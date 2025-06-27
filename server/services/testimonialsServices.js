import Testimonials from "../models/testimonialsModels.js";
import { v4 as uuidv4 } from "uuid";

const createTestimonial = async (testimonialData) => {
  const { firstName, lastName, emailAddress, remarks, rating } =
    testimonialData || {};

  const testimonialId = uuidv4();

  try {
    const testimonial = await Testimonials.create({
      testimonialId,
      firstName,
      lastName,
      emailAddress,
      remarks,
      rating,
    });

    return `Testimonial with ID ${testimonial.testimonialId} successfully created.`;
  } catch (error) {
    console.error("Error creating testimonial:", error.message);
    throw new Error(error);
  }
};

const getTestimonials = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const testimonials = await Testimonials.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Testimonials.countDocuments(filters);

    return {
      testimonials,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalTestimonials: totalCount,
    };
  } catch (error) {
    console.error("Error fetching testimonials:", error.message);
    throw new Error(error);
  }
};

const getSingleTestimonial = async (testimonialId) => {
  try {
    const testimonial = await Testimonials.findOne({ testimonialId });

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    return testimonial;
  } catch (error) {
    console.error("Error fetching testimonial:", error.message);
    throw new Error(error);
  }
};

const updateTestimonialStatus = async (testimonialId, isPosted) => {
  try {
    const testimonial = await Testimonials.findOneAndUpdate(
      { testimonialId },
      { $set: { isPosted: isPosted } },
      { new: true }
    );

    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    return testimonial;
  } catch (error) {
    console.error("Error updating testimonial status:", error.message);
    throw new Error(error);
  }
};

const deleteTestimonial = async (testimonialId) => {
  try {
    const testimonial = await getSingleTestimonial(testimonialId);
    const deletedTestimonial = await Testimonials.findOneAndDelete({ testimonialId: testimonial.testimonialId });

    if (!deleteTestimonial) {
      throw new Error("Testimonial not found");
    }

    return `Testimonial with ID ${deletedTestimonial.testimonialId} successfully deleted.`;
  } catch (error) {
    console.error("Error deleting testimonial:", error.message);
    throw new Error(error);
  }
};

export default {
  createTestimonial,
  getTestimonials,
  getSingleTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
};
