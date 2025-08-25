import mongoose from "mongoose";
import Accommodations from "../models/accommodationsModel.js";
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

export default {
  createAccommodation,
  getAccommodationsByQuery,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodation
};
