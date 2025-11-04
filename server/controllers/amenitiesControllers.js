import expressAsync from "express-async-handler";
import amenitiesServices from "../services/amenitiesServices.js";
import amenitiesTypeServices from "../services/amenitiesTypeServices.js";
import textFormatter from "../utils/textFormatter.js";

const createAmenities = expressAsync(async (req, res) => {
  try {
    const pictures = req.files?.["pictures"]
      ? req.files["pictures"].map((file) => ({ image: file.path }))
      : [];

    // derive thumbnail from selected index (fallback to first picture)
    const thumbnailIndex = Number.isInteger(parseInt(req.body?.thumbnailIndex))
      ? parseInt(req.body.thumbnailIndex)
      : 0;
    const safeIndex = Math.min(Math.max(thumbnailIndex, 0), Math.max(pictures.length - 1, 0));
    const thumbnail = pictures.length > 0 ? pictures[safeIndex]?.image : "";

    const payload = {
      ...req.body,
      thumbnail,
      pictures,
    };

    const type = await amenitiesTypeServices.getSingleAmenitiesType(
      req.body.type
    );
    const isTypeExists = !!type;

    if (!isTypeExists) {
      await amenitiesTypeServices.createAmenitiesType({
        name: textFormatter.fromSlug(req.body.type),
      });
    }

    const amenities = await amenitiesServices.createAmenities(payload);

    res.status(201).json({
      success: true,
      message: `${amenities?.name} has been successfully added.`,
      data: amenities,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getAmenitiesByQuery = expressAsync(async (req, res) => {
  try {
    const result = await amenitiesServices.getAmenitiesByQuery(req.query);
    res.json(result);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const getAmenitiesById = expressAsync(async (req, res) => {
  try {
    const amenities = await amenitiesServices.getAmenitiesById(req.params.id);
    res.json(amenities);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const updateAmenitiesById = expressAsync(async (req, res) => {
  try {
    const amenities = await amenitiesServices.getAmenitiesById(req.params.id);

    if (!amenities) {
      return res.status(404).json({ message: "Amenities not found" });
    }

    const newPictures =
      req.files?.["pictures"]?.map((file) => ({ image: file.path })) || [];
    const existingPictures = req.body.existingFiles
      ? JSON.parse(req.body.existingFiles)
      : amenities.pictures || [];
    const pictures = [...existingPictures, ...newPictures];

    // compute thumbnail from provided index or preserve current if still present
    let thumbnailIndex = Number.isInteger(parseInt(req.body?.thumbnailIndex))
      ? parseInt(req.body.thumbnailIndex)
      : undefined;
    if (thumbnailIndex === undefined) {
      const currentIdx = pictures.findIndex((p) => p.image === amenities.thumbnail);
      thumbnailIndex = currentIdx >= 0 ? currentIdx : 0;
    }
    const safeIndex = Math.min(Math.max(thumbnailIndex, 0), Math.max(pictures.length - 1, 0));
    const thumbnail = pictures[safeIndex]?.image || amenities.thumbnail;

    const payload = {
      ...req.body,
      thumbnail,
      pictures,
      price: req.body.price ? Number(req.body.price) : amenities.price,
    };

    const updatedAmenities = await amenitiesServices.updateAmenitiesById(
      req.params.id,
      payload
    );

    res.json({
      message: `${updatedAmenities?.name} has been successfully updated.`,
      data: updatedAmenities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

const deleteAmenities = expressAsync(async (req, res) => {
  try {
    const deletedAmenities = await amenitiesServices.deleteAmenities(
      req.params.id
    );
    res.json({
      message: `${deletedAmenities?.name} has been successfully deleted.`,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

export {
  createAmenities,
  getAmenitiesByQuery,
  getAmenitiesById,
  updateAmenitiesById,
  deleteAmenities,
};
