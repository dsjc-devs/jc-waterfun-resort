import express from "express";
import {
  createAccommodation,
  getAccommodationsByQuery,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodation,
  checkAvailability,
  getFeaturedAccommodations
} from "../controllers/accommodationControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import createUploadMiddleware from '../middleware/multer/uploadMiddleware.js'

const router = express.Router();

router.post(
  "/",
  protect,
  createUploadMiddleware({
    fields: [
      { name: 'pictures', maxCount: 10 }
    ],
    fieldFolders: {
      pictures: 'accommodations/pictures'
    }
  }),
  createAccommodation
);
router.get("/", getAccommodationsByQuery);
router.get("/featured", getFeaturedAccommodations);
router.get("/check-availability", checkAvailability);

router.get("/:id", getAccommodationById);
router.patch(
  "/:id",
  protect,
  createUploadMiddleware({
    fields: [
      { name: 'pictures', maxCount: 10 }
    ],
    fieldFolders: {
      pictures: 'accommodations/pictures'
    }
  }),
  updateAccommodationById
);
router.delete("/:id", protect, deleteAccommodation);

export default router;
