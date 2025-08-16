import expressAsync from "express-async-handler";
import accommodationTypeServices from "../services/accommodationTypeServices.js";

const createAccommodationType = expressAsync(async (req, res) => {
  try {
    const accommodation = await accommodationTypeServices.createAccommodationType(req.body);
    res.status(201).json({ message: `${accommodation?.title} has been successfully added.` });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getAllAccommodationTypes = expressAsync(async (req, res) => {
  try {
    const accommodations = await accommodationTypeServices.getAllAccommodationTypes();
    res.json(accommodations);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const updateAccomodationType = expressAsync(async (req, res) => {
  try {
    const updatedAccomodation = await accommodationTypeServices.updateAccomodationType(
      req.params.id,
      req.body
    );
    res.json({ message: `${updatedAccomodation?.title} has been successfully updated.` });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const deleteAccomodationType = expressAsync(async (req, res) => {
  try {
    const deletedAccomodation = await accommodationTypeServices.deleteAccomodationType(req.params.id);
    res.json({ message: `${deletedAccomodation?.title} has been successfully deleted.` });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export {
  createAccommodationType,
  getAllAccommodationTypes,
  updateAccomodationType,
  deleteAccomodationType
};
