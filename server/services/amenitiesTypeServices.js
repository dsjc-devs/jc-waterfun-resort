import { NO_CATEGORY } from "../constants/constants.js";
import AmenitiesType from "../models/amenitiesTypeModels.js";
import Amenities from "../models/amenitiesModels.js";
import textFormatter from "../utils/textFormatter.js";

const createAmenitiesType = async (amenitiesData) => {
  try {
    const amenitiesType = await AmenitiesType.create(amenitiesData);
    return amenitiesType;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create amenities type");
  }
};

const getAllAmenitiesTypes = async () => {
  try {
    const amenitiesTypes = await AmenitiesType.find();

    const withCounts = await Promise.all(
      amenitiesTypes.map(async (type) => {
        const count = await Amenities.countDocuments({ type: type.slug });
        return {
          ...type.toObject(),
          count,
        };
      })
    );

    return withCounts;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to get amenities type with counts");
  }
};

const getSingleAmenitiesType = async (type) => {
  try {
    const amenitiesType = await AmenitiesType.findOne({ slug: type });
    return amenitiesType;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to get amenities type");
  }
};

const updateAmenitiesType = async (id, updateData) => {
  try {
    const prevAmenitiesType = await AmenitiesType.findOne({ _id: id });

    const updatedAmenitiesType = await AmenitiesType.findByIdAndUpdate(
      id,
      {
        name: updateData.name,
        slug: textFormatter.toSlug(updateData.name),
      },
      { new: true, runValidators: true }
    );

    if (!updatedAmenitiesType) {
      throw new Error("Amenities type not found");
    }

    await Amenities.updateMany(
      { type: prevAmenitiesType.slug },
      { $set: { type: textFormatter.toSlug(updateData.name) } }
    );

    return updatedAmenitiesType;
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to update amenities type");
  }
};

const deleteAmenitiesType = async (id) => {
  try {
    let unplacedType = await AmenitiesType.findOne({ name: NO_CATEGORY });
    if (!unplacedType) {
      unplacedType = await AmenitiesType.create({
        name: NO_CATEGORY,
        slug: textFormatter.toSlug(NO_CATEGORY),
      });
    }

    const amenitiesType = await AmenitiesType.findById(id);
    if (!amenitiesType) {
      throw new Error("Amenities type not found");
    }

    await Amenities.updateMany(
      { type: amenitiesType.slug },
      { $set: { type: unplacedType.slug, status: "UNPOSTED" } }
    );

    const deletedAmenitiesType = await AmenitiesType.findByIdAndDelete(id);

    return deletedAmenitiesType;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete amenities type");
  }
};

export default {
  createAmenitiesType,
  getAllAmenitiesTypes,
  updateAmenitiesType,
  deleteAmenitiesType,
  getSingleAmenitiesType,
};