import { NO_CATEGORY } from "../constants/constants.js";
import AccommodationType from "../models/accommodationTypeModels.js";
import Accommodations from "../models/accommodationsModel.js";
import textFormatter from "../utils/textFormatter.js";

const createAccommodationType = async (accomData) => {
  try {
    const accomodation = await AccommodationType.create(accomData);
    return accomodation;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create accomodation type");
  }
};

const getAllAccommodationTypes = async () => {
  try {
    const accommodationTypes = await AccommodationType.find();

    const withCounts = await Promise.all(
      accommodationTypes.map(async (type) => {
        const count = await Accommodations.countDocuments({ type: type.slug });
        return {
          ...type.toObject(),
          count
        };
      })
    );

    return withCounts;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to get accommodations type with counts");
  }
};

const getSingleAccomodationType = async (type) => {
  try {
    const accommodation = await AccommodationType.findOne({ slug: type });
    return accommodation;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to get accommodation type");
  }
};

const updateAccomodationType = async (id, updateData) => {
  try {
    const prevAccommodationType = await AccommodationType.findOne({ _id: id })

    const updatedAccomodation = await AccommodationType.findByIdAndUpdate(
      id,
      {
        title: updateData.title,
        slug: textFormatter.toSlug(updateData.title)
      },
      { new: true, runValidators: true }
    );

    if (!updatedAccomodation) {
      throw new Error("Accomodation not found");
    }

    await Accommodations.updateMany({ type: prevAccommodationType.slug }, { $set: { type: textFormatter.toSlug(updateData.title) } })
    return updatedAccomodation
  } catch (error) {
    console.error(error.message);
    throw new Error(error.message || "Failed to update accomodation type");
  }
};

const deleteAccomodationType = async (id) => {
  try {
    let unplacedType = await AccommodationType.findOne({ title: NO_CATEGORY });
    if (!unplacedType) {
      unplacedType = await AccommodationType.create({ title: NO_CATEGORY, slug: textFormatter.toSlug(NO_CATEGORY) });
    }

    const accommodationType = await AccommodationType.findById(id);
    if (!accommodationType) {
      throw new Error("Accommodation type not found");
    }

    await Accommodations.updateMany(
      { type: accommodationType.slug },
      { $set: { type: unplacedType.slug, status: "UNPOSTED" } }
    );

    const deletedAccommodation = await AccommodationType.findByIdAndDelete(id);

    return deletedAccommodation;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete accommodation type");
  }
};

export default {
  createAccommodationType,
  getAllAccommodationTypes,
  updateAccomodationType,
  deleteAccomodationType,
  getSingleAccomodationType
};
