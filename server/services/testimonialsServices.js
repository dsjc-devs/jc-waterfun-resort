import Testimonials from "../models/testimonialsModels.js";
import Reservation from "../models/reservationsModels.js";
import { v4 as uuidv4 } from "uuid";

const createTestimonial = async (testimonialData) => {
  const { userId, reservationId, firstName, lastName, emailAddress, remarks, rating } =
    testimonialData || {};

  const testimonialId = uuidv4();

  try {
    if (!userId) {
      const err = new Error("Missing userId. Only customers with reservations can submit testimonials.");
      err.statusCode = 400;
      throw err;
    }
    // Require a matching reservation (by id preferred; fallback to userId)
    let hasReservation = null;
    if (reservationId) {
      hasReservation = await Reservation.exists({ reservationId });
    } else {
      hasReservation = await Reservation.exists({ userId });
    }
    if (!hasReservation) {
      const err = new Error("Not eligible to post a testimonial. A completed or existing reservation is required.");
      err.statusCode = 400;
      throw err;
    }

    const testimonial = await Testimonials.create({
      testimonialId,
      userId,
      reservationId,
      firstName,
      lastName,
      emailAddress,
      remarks,
      rating,
    });

    return `Testimonial with ID ${testimonial.testimonialId} successfully created.`;
  } catch (error) {
    console.error("Error creating testimonial:", error.message);
    // bubble up status code if set
    if (error.statusCode) {
      throw error;
    }
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
      .limit(limit)
      .lean();

    // Attach reservationCreatedAt via lookup
    const reservationIds = testimonials
      .map(t => t.reservationId)
      .filter(Boolean);
    const reservations = reservationIds.length
      ? await Reservation.find({ reservationId: { $in: reservationIds } })
        .select('reservationId createdAt')
        .lean()
      : [];
    const map = new Map(reservations.map(r => [r.reservationId, r.createdAt]));
    const enriched = testimonials.map(t => ({
      ...t,
      reservationCreatedAt: map.get(t.reservationId) || null,
    }));

    const totalCount = await Testimonials.countDocuments(filters);

    return {
      testimonials: enriched,
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

    if (!deletedTestimonial) {
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
