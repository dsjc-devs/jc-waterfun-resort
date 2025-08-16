import Accommodations from "../models/accommodationsModel.js";

const createAccommodation = async (accomData) => {
  try {
    const accommodation = await Accommodations.create(accomData);
    return accommodation;
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

    const { page: _page, limit: _limit, search, ...filters } = queryObject;

    const query = { ...filters };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const accommodations = await Accommodations.find(query)
      .sort({ createdAt: -1 })
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
    const updatedAccommodation = await Accommodations.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
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
