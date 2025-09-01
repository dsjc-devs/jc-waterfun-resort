import Reservation from "../models/reservationsModels.js";
import generateRandomString from "../utils/generateRandomString.js";

const hasDateConflict = async (accommodationId, newStartDate, newEndDate) => {
  const conflict = await Reservation.findOne({
    accommodationId,
    status: { $ne: "CANCELLED" },
    $or: [
      { startDate: { $lte: newStartDate }, endDate: { $gte: newStartDate } },
      { startDate: { $lte: newEndDate }, endDate: { $gte: newEndDate } },
      { startDate: { $gte: newStartDate }, endDate: { $lte: newEndDate } }
    ]
  });

  return !!conflict;
};

const createReservation = async (reservationData) => {
  try {
    const { accommodationId, startDate, endDate, amount } = reservationData || {};
    const { totalPaid, minimumPayable } = amount || {};

    if (totalPaid < minimumPayable) {
      throw new Error("Total paid must be equal to or greater than the minimum payable amount.");
    }

    const conflict = await hasDateConflict(accommodationId, startDate, endDate);
    if (conflict) {
      throw new Error("Selected dates are not available for this accommodation.");
    }
    const reservationId = generateRandomString(6)

    const reservation = await Reservation.create({
      reservationId,
      ...reservationData
    });
    return reservation;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw new Error(error.message || "Failed to create reservation");
  }
};

const getReservationsByQuery = async (queryObject = {}) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const reservations = await Reservation.find(filters)
      .populate('accommodationId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Reservation.countDocuments(filters);

    return {
      reservations,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalReservations: totalCount,
    };
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error(error);
  }
}

const getSingleReservationById = async (reservationId) => {
  try {
    const reservation = await Reservation.findOne({
      _id: reservationId,
    }).populate('accommodationId')

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    return reservation;
  } catch (error) {
    console.error("Error fetching reservation:", error);
    throw new Error(error);
  }
}

const updateReservationById = async (reservationId, updateData) => {
  try {
    const currentReservation = await Reservation.findById(reservationId);
    if (!currentReservation) {
      throw new Error("Reservation not found");
    }

    Object.keys(updateData).forEach(key => {
      currentReservation[key] = updateData[key];
    });

    const updatedReservation = await currentReservation.save();
    return updatedReservation;
  } catch (error) {
    console.error("Error updating reservation:", error.message);
    throw new Error(error);
  }
}

const deleteReservationById = async (reservationId) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);
    return deletedReservation;
  }
  catch (error) {
    console.error("Error deleting reservation:", error.message);
    throw new Error(error);
  }
}

export default {
  hasDateConflict,
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  deleteReservationById
}