import express from "express";
import {
  createAmenitiesType,
  getAllAmenitiesTypes,
  getSingleAmenitiesType,
  updateAmenitiesType,
  deleteAmenitiesType,
} from "../controllers/amenitiesTypeControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAmenitiesType);
router.get("/", getAllAmenitiesTypes);
router.get("/:id", getSingleAmenitiesType);
router.patch("/:id", protect, updateAmenitiesType);
router.delete("/:id", protect, deleteAmenitiesType);

export default router;