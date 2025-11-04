import expressAsync from "express-async-handler";
import accommodationsServices from "../services/accommodationsServices.js";
import accommodationTypeServices from "../services/accommodationTypeServices.js";
import textFormatter from "../utils/textFormatter.js";

const createAccommodation = expressAsync(async (req, res) => {
  try {
    const pictures = req.files?.['pictures']
      ? req.files['pictures'].map(file => ({ image: file.path }))
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

    const type = await accommodationTypeServices.getSingleAccomodationType(req.body.type)
    const isTypeExists = !!type

    if (!isTypeExists) {
      await accommodationTypeServices.createAccommodationType({ title: textFormatter.fromSlug(req.body.type) })
    }

    const accommodations = await accommodationsServices.createAccommodation(payload);

    res.status(201).json({
      success: true,
      count: Array.isArray(accommodations) ? accommodations.length : 1,
      message: Array.isArray(accommodations)
        ? `${accommodations.length} accommodations have been successfully added.`
        : `${accommodations?.name} has been successfully added.`,
      data: accommodations,
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

    const newPictures = req.files?.['pictures']?.map(file => ({ image: file.path })) || [];
    const existingPictures = req.body.existingFiles
      ? JSON.parse(req.body.existingFiles)
      : accommodation.pictures || [];
    const pictures = [...existingPictures, ...newPictures];

    // compute thumbnail from provided index or preserve current if still present
    let thumbnailIndex = Number.isInteger(parseInt(req.body?.thumbnailIndex))
      ? parseInt(req.body.thumbnailIndex)
      : undefined;
    if (thumbnailIndex === undefined) {
      const currentIdx = pictures.findIndex((p) => p.image === accommodation.thumbnail);
      thumbnailIndex = currentIdx >= 0 ? currentIdx : 0;
    }
    const safeIndex = Math.min(Math.max(thumbnailIndex, 0), Math.max(pictures.length - 1, 0));
    const thumbnail = pictures[safeIndex]?.image || accommodation.thumbnail;

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

const checkAvailability = expressAsync(async (req, res) => {
  try {
    const { startDate, endDate, guests, minPrice, maxPrice } = req.query;

    // Validate required fields
    if (!guests || guests < 1) {
      return res.status(400).json({
        success: false,
        message: "Number of guests is required and must be at least 1"
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Allow same day for tour bookings (when startDate equals endDate)
      if (start > end) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be before start date"
        });
      }

      if (start < new Date().setHours(0, 0, 0, 0)) {
        return res.status(400).json({
          success: false,
          message: "Tour date cannot be in the past"
        });
      }
    }

    const criteria = {
      startDate,
      endDate,
      guests: parseInt(guests),
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await accommodationsServices.checkAvailability(criteria);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error in checkAvailability controller:", error);
    throw new Error(error);
  }
});

const getFeaturedAccommodations = expressAsync(async (req, res) => {
  try {
    const featuredAccommodations = await accommodationsServices.getFeaturedAccommodations();
    res.json({
      success: true,
      count: featuredAccommodations.length,
      data: featuredAccommodations,
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
  checkAvailability,
  getFeaturedAccommodations,
};
