import express from "express";

import {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../controllers/testimonialsControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const allowAdmin = (req, res, next) => {
  const role = req.user?.position?.[0]?.value;
  if (role === 'MASTER_ADMIN' || role === 'ADMIN') return next();
  return res.status(403).json({ message: "Only Master Admin or Admin can perform this action." });
};

router.post("/create", protect, createTestimonial);
router.get("/", getTestimonials);
router.get("/:testimonialId", getSingleTestimonial);
router.patch("/:testimonialId", protect, allowAdmin, updateTestimonialStatus);
router.delete("/:testimonialId", protect, allowAdmin, deleteTestimonial);

export default router;