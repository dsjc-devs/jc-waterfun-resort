import AccommodationType from "../models/accommodationTypeModels.js";

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
    const accommodations = await AccommodationType.find();
    return accommodations;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to get accommodations type");
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
    const updatedAccomodation = await AccommodationType.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedAccomodation) {
      throw new Error("Accomodation not found");
    }
    return updatedAccomodation;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update accomodation type");
  }
};

const deleteAccomodationType = async (id) => {
  try {
    const deletedAccomodation = await AccommodationType.findByIdAndDelete(id);
    if (!deletedAccomodation) {
      throw new Error("Accomodation not found");
    }
    return deletedAccomodation;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete accomodation type");
  }
};

export default {
  createAccommodationType,
  getAllAccommodationTypes,
  updateAccomodationType,
  deleteAccomodationType,
  getSingleAccomodationType
};
