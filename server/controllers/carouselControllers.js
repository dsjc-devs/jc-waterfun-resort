import expressAsync from "express-async-handler";
import carouselServices from "../services/carouselServices.js";

const createCarousel = expressAsync(async (req, res) => {
  try {
    const image = req.files && req.files['image'] ? req.files['image'][0].path : "";
    const { title = "", subtitle = "", isPosted } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const parsedIsPosted =
      isPosted === undefined
        ? undefined
        : [true, 'true', '1', 'on', 'yes'].includes(isPosted);

    const payload = {
      image,
      title,
      subtitle,
      ...(parsedIsPosted !== undefined && { isPosted: parsedIsPosted })
    };

    const response = await carouselServices.createCarousel(payload);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getAllCarousels = expressAsync(async (req, res) => {
  try {
    const response = await carouselServices.getAllCarousels(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleCarouselById = expressAsync(async (req, res) => {
  try {
    const response = await carouselServices.getSingleCarouselById(req.params.carouselId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateCarouselById = expressAsync(async (req, res) => {
  try {
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const image = imageFile ? imageFile.path : req.body.image;
    const { title, subtitle, isPosted } = req.body;

    const parsedIsPosted =
      isPosted === undefined
        ? undefined
        : [true, 'true', '1', 'on', 'yes'].includes(isPosted);

    const payload = {};
    if (image) {
      payload.image = image;
    }
    if (title !== undefined) {
      payload.title = title;
    }
    if (subtitle !== undefined) {
      payload.subtitle = subtitle;
    }
    if (parsedIsPosted !== undefined) {
      payload.isPosted = parsedIsPosted;
    }

    const response = await carouselServices.updateCarouselById(req.params.carouselId, payload);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteCarouselById = expressAsync(async (req, res) => {
  try {
    const response = await carouselServices.deleteCarouselById(req.params.carouselId);
    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createCarousel,
  getAllCarousels,
  getSingleCarouselById,
  updateCarouselById,
  deleteCarouselById,
};
