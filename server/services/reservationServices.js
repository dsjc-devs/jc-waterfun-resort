import { sendSMS } from "../utils/sendSMS.js";

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
    const phoneNumber = reservationData?.userData?.phoneNumber;

    if (hasEmailAddress) {
      await sendReservationDetails({ ...reservationData, reservationId });
    }

    // Send SMS confirmation if phone is provided
    if (phoneNumber) {
      try {
        const acc = await Accommodations.findById(accommodationId);
        const formatDate = (d) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
        const msg = `Reservation CONFIRMED: ${reservationId}\n${acc?.name || 'Accommodation'}\n${formatDate(startDate)} to ${formatDate(endDate)}.\nThank you for booking!`;
        await sendSMS({ number: phoneNumber, message: msg });
      } catch (e) {
        console.error("Error sending reservation SMS:", e?.message);
      }
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

// Send reminders 1 day before start date (once)
const sendUpcomingReservationReminders = async () => {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    windowStart.setSeconds(0, 0);
    const windowEnd = new Date(windowStart.getTime() + 60 * 1000); // 1-minute window

    const toRemind = await Reservation.find({
      status: "CONFIRMED",
      reminderSent: { $ne: true },
      startDate: { $gte: windowStart, $lt: windowEnd }
    }).populate("accommodationId");

    if (!toRemind.length) return { sent: 0 };

    for (const reservation of toRemind) {
      const { reservationId, userData, startDate, endDate, amount, accommodationId: accommodationData } = reservation.toObject();

      // Build email
      try {
        const subject = `Reminder: Your reservation starts tomorrow - ${reservationId}`;
        const body = reservationDetails({
          reservationId,
          userData,
          startDate,
          endDate,
          guests: reservation.guests,
          status: "REMINDER",
          amount,
          accommodationData,
          policies: await Policies.find({ status: 'POSTED' }).limit(5),
          faqs: await FAQs.find({ status: 'POSTED' }).limit(5)
        });
        const html = await emailTemplate(body);
        if (userData?.emailAddress) {
          await sendEmail(userData.emailAddress, subject, html);
        }
      } catch (e) {
        console.error("Reminder email error:", e?.message || e);
      }

      // SMS
      try {
        if (userData?.phoneNumber) {
          const formatDate = (d) => new Date(d).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          const msg = `Reminder: Your reservation ${reservationId} starts tomorrow at ${formatDate(startDate)}. See you at John Cezar Waterfun Resort!`;
          await sendSMS({ number: userData.phoneNumber, message: msg });
        }
      } catch (e) {
        console.error("Reminder SMS error:", e?.message);
      }

      // Mark as sent to avoid duplicates
      await Reservation.updateOne({ _id: reservation._id }, { $set: { reminderSent: true } });
    }

    return { sent: toRemind.length };
  } catch (error) {
    console.error("Error sending upcoming reservation reminders:", error);
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

    // SMS notify
    if (userData?.phoneNumber) {
      try {
        const formatDate = (d) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
        const msg = `Reschedule request received: ${reservationId}\nNew: ${formatDate(newStart)} to ${formatDate(newEnd)}.\nWe will update you soon.`;
        await sendSMS({ number: userData.phoneNumber, message: msg });
      } catch (e) {
        console.error("Error sending reschedule request SMS:", e?.message);
      }
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

    // SMS notify decision
    if (userData?.phoneNumber) {
      try {
        const formatDate = (d) => new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
        const decision = reservation.rescheduleRequest.status;
        const msg = `Reschedule ${decision}: ${reservationId}\n${formatDate(reservation.rescheduleRequest.newStartDate)} to ${formatDate(reservation.rescheduleRequest.newEndDate)}${reason ? `\nReason: ${reason}` : ''}`;
        await sendSMS({ number: `09619957794`, message: msg });
      } catch (e) {
        console.error("Error sending reschedule decision SMS:", e?.message);
      }
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
  sendUpcomingReservationReminders,
  requestRescheduleById,
  decideRescheduleById,
}