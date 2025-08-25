import express from "express";
import {
  createAccommodation,
  getAccommodationsByQuery,
  getAccommodationById,
  updateAccommodationById,
  deleteAccommodation
} from "../controllers/accommodationControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import createUploadMiddleware from '../middleware/multer/uploadMiddleware.js'

const router = express.Router();

router.post(
  "/",
  protect,
  createUploadMiddleware({
    fields: [
      { name: 'thumbnail', maxCount: 1 },
      { name: 'pictures', maxCount: 10 }
    ],
    fieldFolders: {
      thumbnail: 'accommodations/thumbnails',
      pictures: 'accommodations/pictures'
    }
  }),
  createAccommodation
);
router.get("/", getAccommodationsByQuery);

router.get("/:id", getAccommodationById);
router.patch(
  "/:id",
  protect,
  createUploadMiddleware({
    fields: [
      { name: 'thumbnail', maxCount: 1 },
      { name: 'pictures', maxCount: 10 }
    ],
    fieldFolders: {
      thumbnail: 'accommodations/thumbnails',
      pictures: 'accommodations/pictures'
    }
  }),
  updateAccommodationById
);
router.delete("/:id", protect, deleteAccommodation);

export default router;
