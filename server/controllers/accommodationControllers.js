import expressAsync from "express-async-handler";
import accommodationsServices from "../services/accommodationsServices.js";
import accommodationTypeServices from "../services/accommodationTypeServices.js";
import textFormatter from "../utils/textFormatter.js";

const createAccommodation = expressAsync(async (req, res) => {
  try {
    const thumbnail = req.files?.['thumbnail']?.[0]?.path || "";

    const pictures = req.files?.['pictures']
      ? req.files['pictures'].map(file => ({ image: file.path }))
      : [];

    const payload = {
      ...req.body,
      thumbnail,
      pictures,
    };

    const type = await accommodationTypeServices.getSingleAccomodationType(req.body.type)
    const isTypeExists = !!type

    if (!isTypeExists) {
      await accommodationTypeServices.createAccommodationType({ title: textFormatter.fromSlug(req.body.type) })
    }

    const accommodation = await accommodationsServices.createAccommodation(payload);

    res.status(201).json({
      message: `${accommodation?.name} has been successfully added.`,
      data: accommodation,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getAccommodationsByQuery = expressAsync(async (req, res) => {
  try {
    const result = await accommodationsServices.getAccommodationsByQuery(req.query);
    res.json(result);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getAccommodationById = expressAsync(async (req, res) => {
  try {
    const accommodation = await accommodationsServices.getAccommodationById(req.params.id);
    res.json(accommodation);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const updateAccommodationById = expressAsync(async (req, res) => {
  try {
    const accommodation = await accommodationsServices.getAccommodationById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    const thumbnail = req.files?.['thumbnail']?.[0]?.path || accommodation.thumbnail;

    const newPictures = req.files?.['pictures']?.map(file => ({ image: file.path })) || [];
    const existingPictures = req.body.existingFiles
      ? JSON.parse(req.body.existingFiles)
      : accommodation.pictures || [];
    const pictures = [...existingPictures, ...newPictures];

    const payload = {
      ...req.body,
      thumbnail,
      pictures,
      dayPrice: req.body.dayPrice ? Number(req.body.dayPrice) : accommodation.price?.day,
      nightPrice: req.body.nightPrice ? Number(req.body.nightPrice) : accommodation.price?.night,
      extraPersonFee: req.body.extraPersonFee ? Number(req.body.extraPersonFee) : accommodation.extraPersonFee,
      capacity: req.body.capacity ? Number(req.body.capacity) : accommodation.capacity,
      maxStayDuration: req.body.maxStayDuration ? Number(req.body.maxStayDuration) : accommodation.maxStayDuration,
    };

    const updatedAccommodation = await accommodationsServices.updateAccommodationById(
      req.params.id,
      payload
    );

    res.json({
      message: `${updatedAccommodation?.name} has been successfully updated.`,
      data: updatedAccommodation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

const deleteAccommodation = expressAsync(async (req, res) => {
  try {
    const deletedAccommodation = await accommodationsServices.deleteAccommodation(req.params.id);
    res.json({
      message: `${deletedAccommodation?.name} has been successfully deleted.`,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export {
  createAccommodation,
  getAccommodationsByQuery,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodation,
};
