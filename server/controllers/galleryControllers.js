import expressAsync from "express-async-handler";
import galleryServices from "../services/galleryServices.js";

const createGalleryImage = expressAsync(async (req, res) => {
  try {
    const image = req.files && req.files['image'] ? req.files['image'][0].path : "";
    
    if (!image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const payload = {
      image,
    };

    const response = await galleryServices.createGalleryImage(payload);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getAllGalleryImages = expressAsync(async (req, res) => {
  try {
    const response = await galleryServices.getAllGalleryImages(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleGalleryImageById = expressAsync(async (req, res) => {
  try {
    const response = await galleryServices.getSingleGalleryImageById(req.params.galleryId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateGalleryImageById = expressAsync(async (req, res) => {
  try {
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const image = imageFile ? imageFile.path : req.body.image || "";

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const payload = {
      image,
    };

    const response = await galleryServices.updateGalleryImageById(req.params.galleryId, payload);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteGalleryImageById = expressAsync(async (req, res) => {
  try {
    const response = await galleryServices.deleteGalleryImageById(req.params.galleryId);
    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createGalleryImage,
  getAllGalleryImages,
  getSingleGalleryImageById,
  updateGalleryImageById,
  deleteGalleryImageById,
};
