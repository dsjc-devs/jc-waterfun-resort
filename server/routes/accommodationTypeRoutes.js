import express from "express";
import {
  createAccommodationType,
  getAllAccommodationTypes,
  updateAccomodationType,
  deleteAccomodationType
} from "../controllers/accommodationTypeControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAccommodationType);
router.get("/", getAllAccommodationTypes);
router.patch("/:id", protect, updateAccomodationType);
router.delete("/:id", protect, deleteAccomodationType);

export default router;
