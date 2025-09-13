import Reservation from "../models/reservationsModels.js";
import generateRandomString from "../utils/generateRandomString.js";
import reservationDetails from "../templates/reservation-details.js";
import sendEmail from "../utils/sendNodeMail.js";
import emailTemplate from "../templates/defaults/index.js";

const hasDateConflict = async (accommodationId, newStartDate, newEndDate) => {
  const conflict = await Reservation.findOne({
    accommodationId,
    status: { $ne: "CANCELLED" },
    startDate: { $lt: newEndDate },
    endDate: { $gt: newStartDate }
  });

  return !!conflict;
};

const sendReservationDetails = async (reservationData) => {
  try {
    const { reservationId, userData } = reservationData;
    const { emailAddress, firstName } = userData || {};

    if (!emailAddress) return;

    const subject = `Reservation Confirmation - ${reservationId}`;
    const body = reservationDetails({
      ...reservationData,
      guestName: firstName || "Guest",
      status: "Confirmed",
    });

    const emailContent = await emailTemplate(body);

    await sendEmail(emailAddress, subject, emailContent);
    console.log("Reservation email sent to:", emailAddress);
  } catch (error) {
    console.error("Error sending reservation email:", error);
  }
};

const createReservation = async (reservationData) => {
  try {
    const { accommodationId, startDate, endDate, amount } = reservationData || {};
    const { totalPaid, minimumPayable, total } = amount || {};

    if (totalPaid < minimumPayable) {
      throw new Error("Total paid must be equal to or greater than the minimum payable amount.");
    }

    const conflict = await hasDateConflict(accommodationId, startDate, endDate);
    if (conflict) {
      throw new Error("Selected dates are not available for this accommodation.");
    }
    const reservationId = generateRandomString(6)

    const paymentStatus = totalPaid === total ? "FULLY_PAID" : "PARTIALLY_PAID";

    const reservation = await Reservation.create({
      reservationId,
      paymentStatus,
      ...reservationData,
    });

    const hasEmailAddress = reservationData?.userData?.emailAddress;

    if (hasEmailAddress) {
      await sendReservationDetails({ ...reservationData, reservationId });
    }

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
      .populate("accommodationId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const transformed = reservations.map((reservation) => {
      const { userId, entrances, amount, ...rest } = reservation.toObject();

      const transformedAmount = amount
        ? {
          ...amount,
          minimumPayable: amount.accommodationTotal
            ? amount.accommodationTotal * 0.5
            : 0,
        }
        : {};

      return {
        ...rest,
        amount: transformedAmount,
      };
    });

    const totalCount = await Reservation.countDocuments(filters);

    return {
      reservations: transformed,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalReservations: totalCount,
    };
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error(error);
  }
};

const getSingleReservationById = async (reservationId) => {
  try {
    const reservation = await Reservation.findOne({ reservationId })
      .populate("accommodationId")

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    const { userId, accommodationId, amount, ...rest } = reservation.toObject();

    const transformedAmount = amount
      ? {
        ...amount,
        minimumPayable: amount.accommodationTotal
          ? amount.accommodationTotal * 0.5
          : 0,
      }
      : {};

    return {
      accommodationData: accommodationId,
      amount: transformedAmount,
      ...rest,
    };
  } catch (error) {
    console.error("Error fetching reservation:", error);
    throw new Error(error.message);
  }
};

const updateReservationById = async (reservationId, updateData) => {
  try {
    const currentReservation = await Reservation.findOne({ reservationId });
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
    const deletedReservation = await Reservation.findOneAndDelete({ reservationId });
    return deletedReservation;
  } catch (error) {
    console.error("Error deleting reservation:", error.message);
    throw new Error(error);
  }
};

const checkAndUpdateReservationStatus = async () => {
  try {
    const now = new Date();

    const cancelled = await Reservation.updateMany(
      {
        status: "PENDING",
        startDate: { $lt: now },
      },
      { $set: { status: "CANCELLED" } }
    );

    const completed = await Reservation.updateMany(
      {
        status: "CONFIRMED",
        endDate: { $lt: now },
      },
      { $set: { status: "COMPLETED" } }
    );

    return { cancelled, completed };

  } catch (error) {
    console.error("Error running reservation status check:", error);
  }
}

export default {
  hasDateConflict,
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  deleteReservationById,
  checkAndUpdateReservationStatus
}