import expressAsync from "express-async-handler";
import amenitiesTypeServices from "../services/amenitiesTypeServices.js";
import textFormatter from "../utils/textFormatter.js";

const createAmenitiesType = expressAsync(async (req, res) => {
  try {
    const isExist = await amenitiesTypeServices.getSingleAmenitiesType(
      textFormatter.toSlug(req.body.name)
    );
    if (!!isExist) {
      throw new Error(`Type ${req.body.name} already exists.`);
    }

    const amenitiesType = await amenitiesTypeServices.createAmenitiesType(
      req.body
    );
    res
      .status(201)
      .json({ message: `${amenitiesType?.name} has been successfully added.` });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getAllAmenitiesTypes = expressAsync(async (req, res) => {
  try {
    const amenitiesTypes = await amenitiesTypeServices.getAllAmenitiesTypes();
    res.json(amenitiesTypes);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getSingleAmenitiesType = expressAsync(async (req, res) => {
  try {
    const amenitiesType = await amenitiesTypeServices.getSingleAmenitiesType(
      req.params.id
    );
    if (!amenitiesType) {
      throw new Error(`Type not found`);
    }
    res.json(amenitiesType);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const updateAmenitiesType = expressAsync(async (req, res) => {
  try {
    const isExist = await amenitiesTypeServices.getSingleAmenitiesType(
      textFormatter.toSlug(req.body.name)
    );
    if (!!isExist) {
      throw new Error(`Type ${req.body.name} already exists.`);
    }

    const updatedAmenitiesType =
      await amenitiesTypeServices.updateAmenitiesType(req.params.id, req.body);
    res.json(updatedAmenitiesType);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const deleteAmenitiesType = expressAsync(async (req, res) => {
  try {
    const deletedAmenitiesType =
      await amenitiesTypeServices.deleteAmenitiesType(req.params.id);
    res.json({
      message: `${deletedAmenitiesType?.name} has been successfully deleted.`,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export {
  createAmenitiesType,
  getAllAmenitiesTypes,
  getSingleAmenitiesType,
  updateAmenitiesType,
  deleteAmenitiesType,
};