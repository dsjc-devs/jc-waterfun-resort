import mongoose from "mongoose";
import Amenities from "../models/amenitiesModels.js";
import textFormatter from "../utils/textFormatter.js";

const createAmenities = async (amenitiesData) => {
  try {
    const amenities = await Amenities.create(amenitiesData);
    return amenities;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to create amenities");
  }
};

const getAmenitiesByQuery = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, search, ...filters } = queryObject;

    const query = { ...filters };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const amenities = await Amenities.find(query)
      .sort({ status: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Amenities.countDocuments(query);

    return {
      amenities,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalAmenities: totalCount,
    };
  } catch (error) {
    console.error("Error fetching amenities:", error.message);
    throw new Error(error.message || "Failed to fetch amenities");
  }
};

const getAmenitiesById = async (id) => {
  try {
    const amenities = await Amenities.findById(id);
    if (!amenities) throw new Error("Amenities not found");
    return amenities;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to fetch amenities");
  }
};

const updateAmenitiesById = async (id, updateData) => {
  try {
    const updatedAmenities = await Amenities.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAmenities) throw new Error("Amenities not found");
    return updatedAmenities;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to update amenities");
  }
};

const deleteAmenities = async (id) => {
  try {
    const deletedAmenities = await Amenities.findByIdAndDelete(id);
    if (!deletedAmenities) throw new Error("Amenities not found");
    return deletedAmenities;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to delete amenities");
  }
};

export default {
  createAmenities,
  getAmenitiesByQuery,
  getAmenitiesById,
  updateAmenitiesById,
  deleteAmenities,
};