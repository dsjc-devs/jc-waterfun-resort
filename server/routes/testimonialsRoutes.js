import express from "express";

import {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../controllers/testimonialsControllers.js";

const router = express.Router();

router.post("/create", createTestimonial);
router.get("/", getTestimonials);
router.get("/:testimonialId", getSingleTestimonial);
router.patch("/:testimonialId", updateTestimonialStatus);
router.delete("/:testimonialId", deleteTestimonial);

export default router;