import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createCarousel,
  getAllCarousels,
  getSingleCarouselById,
  updateCarouselById,
  deleteCarouselById,
} from "../controllers/carouselControllers.js";
import createUploadMiddleware from "../middleware/multer/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createUploadMiddleware({
    fields: [{ name: "image", maxCount: 1 }],
    fieldFolders: {
      image: "carousel_images",
    },
  }),
  createCarousel
);

router.get("/", getAllCarousels);
router.get("/:carouselId", getSingleCarouselById);

router.patch(
  "/:carouselId",
  protect,
  createUploadMiddleware({
    fields: [{ name: "image", maxCount: 1 }],
    fieldFolders: {
      image: "carousel_images",
    },
  }),
  updateCarouselById
);

router.delete("/:carouselId", protect, deleteCarouselById);

export default router;
