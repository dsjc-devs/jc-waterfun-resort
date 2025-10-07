import Accommodations from "../models/accommodationsModels.js";
import Reservation from "../models/reservationsModels.js";
import BlockedDate from "../models/blockedDatesModel.js";
import textFormatter from "../utils/textFormatter.js";

const createAccommodation = async (accomData) => {
  const count = accomData?.count || 1
  try {
    const payloads = Array.from({ length: count }, (_, i) => ({
      ...accomData,
      name: count > 1 ? `${accomData.name} ${i + 1}` : accomData.name,
      groupKey: count > 1 ? `${textFormatter.toSlug(accomData.name)}` : "",
    }));

    const accommodations = await Accommodations.insertMany(payloads);
    return accommodations;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to create accommodation");
  }
};

const getAccommodationsByQuery = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, search, sort, ...filters } = queryObject;

    const query = { ...filters };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      sortOption = { [sort.replace("-", "")]: sort.startsWith("-") ? -1 : 1 };
    }

    const accommodations = await Accommodations.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalCount = await Accommodations.countDocuments(query);

    return {
      accommodations,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalAccommodations: totalCount,
    };
  } catch (error) {
    console.error("Error fetching accommodations:", error.message);
    throw new Error(error.message || "Failed to fetch accommodations");
  }
};

const getAccommodationById = async (id) => {
  try {
    const accommodation = await Accommodations.findById(id);
    if (!accommodation) throw new Error("Accommodation not found");
    return accommodation;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to fetch accommodation");
  }
};

const updateAccommodationById = async (id, updateData) => {
  try {
    const { isUpdateSameType, ...fieldsToUpdate } = updateData;

    const _isUpdateSameType = isUpdateSameType === "true" ? true : false

    let updatedAccommodation;

    if (_isUpdateSameType) {
      const accommodation = await Accommodations.findById(id);
      if (!accommodation) throw new Error("Accommodation not found");

      updatedAccommodation = await Accommodations.updateMany(
        { groupKey: accommodation.groupKey },
        { $set: fieldsToUpdate },
        { runValidators: true }
      );
    } else {
      updatedAccommodation = await Accommodations.findByIdAndUpdate(
        id,
        { $set: fieldsToUpdate },
        { new: true, runValidators: true }
      );
    }

    if (!updatedAccommodation) throw new Error("Accommodation not found");
    return updatedAccommodation;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to update accommodations");
  }
};

const deleteAccommodation = async (id) => {
  try {
    const deletedAccommodation = await Accommodations.findByIdAndDelete(id);
    if (!deletedAccommodation) throw new Error("Accommodation not found");
    return deletedAccommodation;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to delete accommodation");
  }
};

const checkAvailability = async (criteria) => {
  try {
    const { startDate, endDate, guests, minPrice, maxPrice, page = 1, limit = 10 } = criteria;
    const skip = (page - 1) * limit;

    // Build base query for accommodations
    const baseQuery = {
      status: "POSTED",
      capacity: { $gte: guests }
    };

    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter = {};
      if (minPrice !== undefined) {
        priceFilter.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined) {
        priceFilter.$lte = Number(maxPrice);
      }
      baseQuery.$or = [
        { "price.day": priceFilter },
        { "price.night": priceFilter }
      ];
    }

    // Get all accommodations that match basic criteria
    const accommodations = await Accommodations.find(baseQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!startDate || !endDate) {
      // If no dates provided, return all accommodations matching other criteria
      const totalCount = await Accommodations.countDocuments(baseQuery);
      return {
        accommodations,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalAccommodations: totalCount,
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Use the blocked dates service to get all blocked dates (including reservations)
    const blockedDatesServices = await import('../services/blockedDatesServices.js');
    const allBlockedDates = await blockedDatesServices.default.getAllBlockedDates();

    // Filter blocked dates that overlap with requested period
    const conflictingBlockedDates = allBlockedDates.filter(block => {
      const blockStart = new Date(block.startDate);
      const blockEnd = new Date(block.endDate);
      return blockStart < end && blockEnd > start;
    });

    // Separate global and accommodation-specific blocked dates
    const globalBlockedDates = conflictingBlockedDates.filter(block =>
      !block.accommodationId && !block.isFromReservation
    );
    const accommodationBlockedDates = conflictingBlockedDates.filter(block =>
      block.accommodationId
    );

    // Filter out accommodations with conflicts
    const availableAccommodations = accommodations.filter(accommodation => {
      // Check for global blocked dates (affects all accommodations)
      const hasGlobalBlockedDateConflict = globalBlockedDates.length > 0;

      // Check for accommodation-specific blocked dates (includes reservations)
      const hasAccommodationBlockedDateConflict = accommodationBlockedDates.some(
        block => block.accommodationId && block.accommodationId.toString() === accommodation._id.toString()
      );

      return !hasGlobalBlockedDateConflict && !hasAccommodationBlockedDateConflict;
    });

    // Get total count of available accommodations (for pagination)
    const allAvailableAccommodations = await Accommodations.find(baseQuery);
    const allAvailableFiltered = allAvailableAccommodations.filter(accommodation => {
      // Check for global blocked dates (affects all accommodations)
      const hasGlobalBlockedDateConflict = globalBlockedDates.length > 0;

      // Check for accommodation-specific blocked dates (includes reservations)
      const hasAccommodationBlockedDateConflict = accommodationBlockedDates.some(
        block => block.accommodationId && block.accommodationId.toString() === accommodation._id.toString()
      );

      return !hasGlobalBlockedDateConflict && !hasAccommodationBlockedDateConflict;
    });

    return {
      accommodations: availableAccommodations,
      totalPages: Math.ceil(allAvailableFiltered.length / limit),
      currentPage: page,
      totalAccommodations: allAvailableFiltered.length,
    };
  } catch (error) {
    console.error("Error checking availability:", error.message);
    throw new Error(error.message || "Failed to check availability");
  }
};

export default {
  createAccommodation,
  getAccommodationsByQuery,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodation,
  checkAvailability
};
