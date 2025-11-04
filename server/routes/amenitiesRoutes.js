import express from "express";
import {
  createAmenities,
  getAmenitiesByQuery,
  getAmenitiesById,
  updateAmenitiesById,
  deleteAmenities,
} from "../controllers/amenitiesControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import createUploadMiddleware from "../middleware/multer/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createUploadMiddleware({
    fields: [
      { name: "pictures", maxCount: 10 },
    ],
    fieldFolders: {
      pictures: "amenities/pictures",
    },
  }),
  createAmenities
);

router.get("/", getAmenitiesByQuery);

router.get("/:id", getAmenitiesById);

router.patch(
  "/:id",
  protect,
  createUploadMiddleware({
    fields: [
      { name: "pictures", maxCount: 10 },
    ],
    fieldFolders: {
      pictures: "amenities/pictures",
    },
  }),
  updateAmenitiesById
);

router.delete("/:id", protect, deleteAmenities);

export default router;