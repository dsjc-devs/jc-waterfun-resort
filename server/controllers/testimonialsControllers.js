import expressAsync from 'express-async-handler';
import testimonialsServices from '../services/testimonialsServices.js';

const createTestimonial = expressAsync(async (req, res) => {
  try {
    const response = await testimonialsServices.createTestimonial(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getTestimonials = expressAsync(async (req, res) => {
  try {
    const response = await testimonialsServices.getTestimonials(req.query);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleTestimonial = expressAsync(async (req, res) => {
  try {
    const response = await testimonialsServices.getSingleTestimonial(req.params.testimonialId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateTestimonialStatus = expressAsync(async (req, res) => {
  try {
    // Add validation
    if (!req.body || req.body.isPosted === undefined) {
      return res.status(400).json({ 
        message: "Request body must include 'isPosted' field" 
      });
    }

    const response = await testimonialsServices.updateTestimonialStatus(
      req.params.testimonialId, 
      req.body.isPosted
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteTestimonial = expressAsync(async (req, res) => {
  try {
    const response = await testimonialsServices.deleteTestimonial(req.params.testimonialId);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial,
  updateTestimonialStatus,
  deleteTestimonial
};