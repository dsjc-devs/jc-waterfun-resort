import Reservation from "../models/reservationsModels.js";
import generateRandomString from "../utils/generateRandomString.js";
import reservationDetails from "../templates/reservation-details.js";
import sendEmail from "../utils/sendNodeMail.js";
import emailTemplate from "../templates/defaults/index.js";
import Accommodations from "../models/accommodationsModels.js";
import Policies from "../models/policiesModels.js";
import FAQs from "../models/faqsModels.js";
import rescheduleRequestTemplate from "../templates/reschedule-request.js";
import rescheduleDecisionTemplate from "../templates/reschedule-decision.js";

const hasDateConflict = async (accommodationId, newStartDate, newEndDate) => {
  const conflict = await Reservation.findOne({
    accommodationId,
    status: { $ne: "CANCELLED" },
    startDate: { $lt: newEndDate },
    endDate: { $gt: newStartDate }
  });

  return !!conflict;
};

const hasDateConflictExcludingReservation = async (accommodationId, newStartDate, newEndDate, reservationId) => {
  const conflict = await Reservation.findOne({
    accommodationId,
    reservationId: { $ne: reservationId },
    status: { $ne: "CANCELLED" },
    startDate: { $lt: newEndDate },
    endDate: { $gt: newStartDate }
  });
  return !!conflict;
};

const sendReservationDetails = async (reservationData) => {
  try {
    const { reservationId, userData, accommodationId } = reservationData;
    const { emailAddress, firstName } = userData || {};

    if (!emailAddress) return;

    const accommodationData = await Accommodations.findById(accommodationId);

    const [policies, faqs] = await Promise.all([
      Policies.find({ status: 'POSTED' }).limit(5),
      FAQs.find({ status: 'POSTED' }).limit(5)
    ]);

    const subject = `Reservation Confirmation - ${reservationId}`;
    const body = reservationDetails({
      ...reservationData,
      accommodationData,
      policies,
      faqs,
      guestName: firstName || "Guest",
      status: "CONFIRMED",
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

// default export is defined at the end after all functions are declared

// ============ RESCHEDULE FEATURES ============ //

const DAYS = 24 * 60 * 60 * 1000;

const ensureTwoDaysPrior = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);
  if ((start.getTime() - now.getTime()) < 2 * DAYS) {
    throw new Error("Reschedule is only allowed at least 2 days prior to the booking start date.");
  }
};

const requestRescheduleById = async (reservationId, { newStartDate, newEndDate, requestedBy }) => {
  try {
    if (!newStartDate || !newEndDate) {
      throw new Error("New start and end dates are required.");
    }

    const reservation = await Reservation.findOne({ reservationId }).populate("accommodationId");
    if (!reservation) throw new Error("Reservation not found");

    ensureTwoDaysPrior(reservation.startDate);

    if (reservation?.rescheduleRequest?.status === 'PENDING') {
      throw new Error("There is already a pending reschedule request for this reservation.");
    }

    const newStart = new Date(newStartDate);
    const newEnd = new Date(newEndDate);
    if (newStart >= newEnd) throw new Error("End date must be after start date.");

    const conflict = await hasDateConflictExcludingReservation(
      reservation.accommodationId._id,
      newStart,
      newEnd,
      reservationId
    );
    if (conflict) {
      throw new Error("Requested dates are not available for this accommodation.");
    }

    reservation.rescheduleRequest = {
      oldStartDate: reservation.startDate,
      oldEndDate: reservation.endDate,
      newStartDate: newStart,
      newEndDate: newEnd,
      status: 'PENDING',
      requestedBy: requestedBy || reservation?.userId,
      requestedAt: new Date(),
    };

    await reservation.save();

    // Notify customer: subject for confirmation
    const { userData, accommodationId: accommodationData } = reservation.toObject();
    const emailAddress = userData?.emailAddress;
    if (emailAddress) {
      const body = rescheduleRequestTemplate({
        reservationId,
        guestName: userData?.firstName || 'Guest',
        accommodationData,
        oldStartDate: reservation.rescheduleRequest.oldStartDate,
        oldEndDate: reservation.rescheduleRequest.oldEndDate,
        newStartDate: newStart,
        newEndDate: newEnd,
      });
      const emailContent = await emailTemplate(body);
      const subject = `Reschedule Request Received - ${reservationId}`;
      await sendEmail(emailAddress, subject, emailContent);
    }

    return reservation;
  } catch (error) {
    console.error("Error requesting reschedule:", error);
    throw new Error(error.message || "Failed to request reschedule");
  }
};

const decideRescheduleById = async (reservationId, { action, reason, decidedBy }) => {
  try {
    const reservation = await Reservation.findOne({ reservationId }).populate("accommodationId");
    if (!reservation) throw new Error("Reservation not found");

    if (!reservation.rescheduleRequest || reservation.rescheduleRequest.status !== 'PENDING') {
      throw new Error("No pending reschedule request for this reservation.");
    }

    const isApprove = String(action).toUpperCase() === 'APPROVE';

    if (isApprove) {
      const { newStartDate, newEndDate } = reservation.rescheduleRequest;

      // Validate again on approval
      const conflict = await hasDateConflictExcludingReservation(
        reservation.accommodationId._id,
        new Date(newStartDate),
        new Date(newEndDate),
        reservationId
      );
      if (conflict) {
        throw new Error("Requested dates are no longer available.");
      }

      reservation.startDate = newStartDate;
      reservation.endDate = newEndDate;
      // Keep status as CONFIRMED to maintain blocking; mark request approved
      reservation.rescheduleRequest.status = 'APPROVED';
      reservation.rescheduleRequest.decidedBy = decidedBy || null;
      reservation.rescheduleRequest.decidedAt = new Date();
      reservation.rescheduleRequest.reason = reason || reservation.rescheduleRequest.reason;
    } else {
      // Reject
      reservation.rescheduleRequest.status = 'REJECTED';
      reservation.rescheduleRequest.decidedBy = decidedBy || null;
      reservation.rescheduleRequest.decidedAt = new Date();
      reservation.rescheduleRequest.reason = reason || reservation.rescheduleRequest.reason;
    }

    await reservation.save();

    // Notify customer of decision
    const { userData, accommodationId: accommodationData } = reservation.toObject();
    const emailAddress = userData?.emailAddress;
    if (emailAddress) {
      const body = rescheduleDecisionTemplate({
        reservationId,
        guestName: userData?.firstName || 'Guest',
        accommodationData,
        oldStartDate: reservation.rescheduleRequest.oldStartDate,
        oldEndDate: reservation.rescheduleRequest.oldEndDate,
        newStartDate: reservation.rescheduleRequest.newStartDate,
        newEndDate: reservation.rescheduleRequest.newEndDate,
        decision: reservation.rescheduleRequest.status,
        reason
      });
      const emailContent = await emailTemplate(body);
      const subject = `Reschedule ${reservation.rescheduleRequest.status} - ${reservationId}`;
      await sendEmail(emailAddress, subject, emailContent);
    }

    return reservation;
  } catch (error) {
    console.error("Error deciding reschedule:", error);
    throw new Error(error.message || "Failed to decide reschedule");
  }
};

export default {
  hasDateConflict,
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  deleteReservationById,
  checkAndUpdateReservationStatus,
  requestRescheduleById,
  decideRescheduleById,
}