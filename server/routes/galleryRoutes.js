import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createGalleryImage,
  getAllGalleryImages,
  getSingleGalleryImageById,
  updateGalleryImageById,
  deleteGalleryImageById,
} from "../controllers/galleryControllers.js";
import createUploadMiddleware from "../middleware/multer/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createUploadMiddleware({
    fields: [{ name: "image", maxCount: 1 }],
    fieldFolders: {
      image: "gallery_images",
    },
  }),
  createGalleryImage
);

router.get("/", getAllGalleryImages);
router.get("/:galleryId", getSingleGalleryImageById);

router.patch(
  "/:galleryId",
  protect,
  createUploadMiddleware({
    fields: [{ name: "image", maxCount: 1 }],
    fieldFolders: {
      image: "gallery_images",
    },
  }),
  updateGalleryImageById
);

router.delete("/:galleryId", protect, deleteGalleryImageById);

export default router;
