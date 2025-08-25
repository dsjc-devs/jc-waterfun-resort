import express from "express";

import {
  getResortRates,
  updateResortRates
} from "../controllers/resortRatesControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getResortRates);
router.patch("/update", protect, updateResortRates);

export default router;