import { sendSMS } from "../utils/sendSMS.js";
import { formatDateInTimeZone } from "../utils/formatDate.js";
import { isNightBooking, getNightDisplayStrings } from "../utils/bookingMode.js";

import Reservation from "../models/reservationsModels.js";
import generateRandomString from "../utils/generateRandomString.js";
import reservationDetails from "../templates/reservation-details.js";
import sendEmail from "../utils/sendNodeMail.js";
import emailTemplate from "../templates/defaults/index.js";
import Accommodations from "../models/accommodationsModels.js";
import Amenities from "../models/amenitiesModels.js";
import Policies from "../models/policiesModels.js";
import FAQs from "../models/faqsModels.js";
import rescheduleRequestTemplate from "../templates/reschedule-request.js";
import rescheduleDecisionTemplate from "../templates/reschedule-decision.js";
import activityServices from "./activityServices.js";

// Standard footer for all outbound SMS messages
const SMS_FOOTER = "\n(Automated message. Do not reply.)";

// ============ TOTALS UTILITY ============ //
// Centralized helper to compute aggregate total from amount components.
// When base components are missing (common in non–walk-in flows),
// optionally preserve a previous aggregate to avoid collapsing to amenities-only.
const recomputeTotal = ({ amount, nextAmenitiesTotal, preserveWhenBaseMissing = true }) => {
  const amt = amount || {};
  const accommodationTotal = Number(amt.accommodationTotal || 0);
  const entranceTotal = Number(amt.entranceTotal || 0);
  const extraPersonFee = Number(amt.extraPersonFee || 0);
  const prevAmenitiesTotal = Number(amt.amenitiesTotal || 0);
  const beforeTotal = Number(amt.total || 0);
  const amenitiesTotal = Number(
    typeof nextAmenitiesTotal === 'number' ? nextAmenitiesTotal : prevAmenitiesTotal
  );

  const baseAggregateIsZero = (accommodationTotal + entranceTotal + extraPersonFee) === 0; // Check if base totals are missing

  if (preserveWhenBaseMissing && baseAggregateIsZero) {
    // Preserve previously computed aggregate when we don't have base components.
    // If none exist, fall back to 0 to avoid equating total with amenities-only.
    return beforeTotal > 0 ? beforeTotal : 0;
  }

  return accommodationTotal + entranceTotal + amenitiesTotal + extraPersonFee;
};

// Compute base totals server-side when missing.
// - accommodationTotal: derived from accommodation price * nights (at least 1)
// - entranceTotal: preserved from provided amount if any; otherwise 0
// - extraPersonFee: preserved from provided amount if any; otherwise 0
const computeBaseTotals = async ({ accommodationId, startDate, endDate, amount, mode, isDayMode }) => {
  const amt = amount || {};
  let accommodationTotal = Number(amt.accommodationTotal || 0);
  let entranceTotal = Number(amt.entranceTotal || 0);
  let extraPersonFee = Number(amt.extraPersonFee || 0);

  const baseMissing = (accommodationTotal + entranceTotal + extraPersonFee) === 0;
  if (!baseMissing) {
    return { accommodationTotal, entranceTotal, extraPersonFee };
  }

  try {
    const acc = await Accommodations.findById(accommodationId).lean();
    // Prefer day/night differentiated pricing when available
    const useDay = typeof isDayMode === 'boolean' ? isDayMode : (String(mode || '').toLowerCase() === 'day');
    const priceCandidate = useDay ? (acc?.price?.day ?? acc?.price) : (acc?.price?.night ?? acc?.price);
    const price = Number(priceCandidate || 0);
    // Align with Form.jsx: use the per-mode price directly (no nights multiplication)
    // Form.jsx computes total as: price + entranceTotal + extraPersonFee + amenitiesTotal
    // and minimumPayable = price * 0.5
    accommodationTotal = price;
  } catch (e) {
    // If we fail fetching accommodation, keep accommodationTotal as 0
    console.error("Failed to compute accommodationTotal:", e?.message);
  }

  // Keep entrance and extra fees as provided (or 0 if absent)
  return { accommodationTotal, entranceTotal, extraPersonFee };
};

const hasDateConflict = async (accommodationId, newStartDate, newEndDate) => {
  const conflict = await Reservation.findOne({
    accommodationId,
    status: { $ne: "CANCELLED" },
    startDate: { $lt: newEndDate },
    endDate: { $gt: newStartDate }
  });

  return !!conflict;
};

// Helper to find an existing reservation for same accommodation and dates
const getExistingReservationByRange = async (accommodationId, startDate, endDate) => {
  try {
    if (!accommodationId || !startDate || !endDate) return null;
    const existing = await Reservation.findOne({
      accommodationId,
      status: { $ne: "CANCELLED" },
      startDate: { $lt: new Date(endDate) },
      endDate: { $gt: new Date(startDate) },
    }).lean();
    return existing;
  } catch (e) {
    console.error("Error checking existing reservation range:", e?.message);
    return null;
  }
}

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

    // Do not persist client-provided amenities directly; they lack required name/price
    const { amenitiesItems, amenities: clientAmenities, ...restData } = reservationData || {};

    // Normalize amount so totals are consistent even when not walk-in
    // Compute server-side base totals if missing
    const base = await computeBaseTotals({ accommodationId, startDate, endDate, amount, mode: reservationData?.mode, isDayMode: reservationData?.isDayMode });
    const accomTotal = Number(base.accommodationTotal || 0);
    const entranceTotal = Number(base.entranceTotal || 0);
    const amenitiesTotal = Number(amount?.amenitiesTotal || 0);
    const extraPersonFee = Number(base.extraPersonFee || 0);
    // Deterministically recompute total from components; do not preserve when base is missing
    const computedTotal = recomputeTotal({ amount: { ...amount, accommodationTotal: accomTotal, entranceTotal, extraPersonFee, amenitiesTotal }, nextAmenitiesTotal: amenitiesTotal, preserveWhenBaseMissing: false });
    const normalizedAmount = {
      ...amount,
      accommodationTotal: accomTotal,
      entranceTotal,
      amenitiesTotal,
      extraPersonFee,
      total: computedTotal,
    };
    let reservation = await Reservation.create({
      reservationId,
      ...restData,
      amount: normalizedAmount,
      amenities: [],
    });

    // Always trigger amenities update (even with empty list) to normalize totals consistently
    try {
      const items = Array.isArray(amenitiesItems) ? amenitiesItems : [];
      reservation = await updateReservationAmenitiesById(reservationId, { items });
    } catch (e) {
      console.error("Failed to update amenities on create:", e?.message || e);
    }

    // Record activity: reservation created
    try {
      const firstName = reservationData?.userData?.firstName || "Unknown";
      const lastName = reservationData?.userData?.lastName || "";
      const when = formatDateInTimeZone(reservation.createdAt, { includeTime: true });
      await activityServices.createActivity({
        reservationId,
        type: "RESERVATION_CREATED",
        createdAt: reservation.createdAt,
        description: `${firstName} ${lastName} of the customer booked a reservation on ${when}`.trim(),
      });

      // If already fully paid at creation, log it explicitly
      const totalPaid = reservationData?.amount?.totalPaid ?? 0;
      const total = reservationData?.amount?.total ?? 0;
      if (total && totalPaid >= total) {
        await activityServices.createActivity({
          reservationId,
          type: "PAYMENT_FULLY_PAID",
          createdAt: reservation.createdAt,
          description: `Reservation is now FULLY PAID (${totalPaid}/${total}) on ${when}`,
        });
      }
    } catch (e) {
      console.error("Failed to record reservation created activity:", e?.message);
    }

    const hasEmailAddress = reservationData?.userData?.emailAddress;
    const phoneNumber = reservationData?.userData?.phoneNumber;

    if (hasEmailAddress) {
      await sendReservationDetails({ ...reservationData, reservationId });
    }

    // Send SMS confirmation if phone is provided
    if (phoneNumber) {
      try {
        const acc = await Accommodations.findById(accommodationId);
        const night = isNightBooking({
          mode: reservationData?.mode,
          isDayMode: reservationData?.isDayMode,
          startDate,
          endDate,
        });
        const { start: s, end: e } = night
          ? getNightDisplayStrings(startDate, endDate)
          : { start: formatDateInTimeZone(startDate, { includeTime: true }), end: formatDateInTimeZone(endDate, { includeTime: true }) };
        const msg = `Reservation CONFIRMED: ${reservationId}\n${acc?.name || 'Accommodation'}\n${s} to ${e}.\nThank you for booking!${SMS_FOOTER}`;
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

    const before = {
      startDate: currentReservation.startDate,
      endDate: currentReservation.endDate,
      status: currentReservation.status,
      amount: currentReservation.amount,
      guests: currentReservation.guests,
      entrances: currentReservation.entrances,
      accommodationId: currentReservation.accommodationId,
      userData: currentReservation.userData,
      isWalkIn: currentReservation.isWalkIn,
      firstName: currentReservation?.userData?.firstName || "Unknown",
      lastName: currentReservation?.userData?.lastName || "",
    };

    Object.keys(updateData).forEach(key => {
      currentReservation[key] = updateData[key];
    });

    // Recompute amount.total (and related derived fields) if any amount components changed
    const amt = currentReservation.amount || {};
    const accomTotal = Number(amt.accommodationTotal || 0);
    const entranceTotal = Number(amt.entranceTotal || 0);
    const amenitiesTotal = Number(amt.amenitiesTotal || 0);
    const extraPersonFee = Number(amt.extraPersonFee || 0);
    const recomputedTotal = recomputeTotal({ amount: amt, preserveWhenBaseMissing: false });

    // If total differs or components provided in updateData, set the recomputed total
    const componentsTouched = (
      updateData?.amount?.hasOwnProperty('accommodationTotal') ||
      updateData?.amount?.hasOwnProperty('entranceTotal') ||
      updateData?.amount?.hasOwnProperty('amenitiesTotal') ||
      updateData?.amount?.hasOwnProperty('extraPersonFee')
    );
    if (componentsTouched || Number(amt.total || 0) !== recomputedTotal) {
      currentReservation.amount = {
        ...amt,
        total: recomputedTotal,
        // Keep minimumPayable derived from accommodationTotal for consistency in getters
      };
    }

    const updatedReservation = await currentReservation.save();

    // Record activity summarizing the update
    try {
      const nowWhen = formatDateInTimeZone(updatedReservation.updatedAt || new Date(), { includeTime: true });
      const events = [];

      const oldStart = before.startDate ? formatDateInTimeZone(before.startDate, { includeTime: true }) : "";
      const oldEnd = before.endDate ? formatDateInTimeZone(before.endDate, { includeTime: true }) : "";
      const newStart = updatedReservation.startDate ? formatDateInTimeZone(updatedReservation.startDate, { includeTime: true }) : "";
      const newEnd = updatedReservation.endDate ? formatDateInTimeZone(updatedReservation.endDate, { includeTime: true }) : "";

      const datesChanged = (before.startDate?.getTime?.() || 0) !== (updatedReservation.startDate?.getTime?.() || 0)
        || (before.endDate?.getTime?.() || 0) !== (updatedReservation.endDate?.getTime?.() || 0);
      const statusChanged = before.status !== updatedReservation.status && updatedReservation.status;

      // Payment change / fully paid detection
      const beforePaid = before?.amount?.totalPaid ?? 0;
      const beforeTotal = before?.amount?.total ?? 0;
      const afterPaid = updatedReservation?.amount?.totalPaid ?? beforePaid;
      const afterTotal = updatedReservation?.amount?.total ?? beforeTotal;
      const paymentChanged = afterPaid !== beforePaid || afterTotal !== beforeTotal;
      const becameFullyPaid = afterTotal > 0 && afterPaid >= afterTotal && !(beforeTotal > 0 && beforePaid >= beforeTotal);

      if (datesChanged) {
        events.push({
          type: "SCHEDULE_UPDATED",
          description: `Reservation schedule updated from ${oldStart}–${oldEnd} to ${newStart}–${newEnd} on ${nowWhen}`.trim(),
        });
      }
      if (statusChanged) {
        const from = before.status ? String(before.status).toUpperCase() : 'UNKNOWN';
        const to = String(updatedReservation.status).toUpperCase();
        events.push({
          type: "STATUS_UPDATED",
          description: `Reservation status updated from ${from} to ${to} on ${nowWhen}`,
        });
      }
      if (becameFullyPaid) {
        events.push({
          type: "PAYMENT_FULLY_PAID",
          description: `Reservation is now FULLY PAID (${afterPaid}/${afterTotal}) on ${nowWhen}`,
        });
      } else if (paymentChanged) {
        events.push({
          type: "PAYMENT_UPDATED",
          description: `Payment updated: ${afterPaid}/${afterTotal} on ${nowWhen}`,
        });
      }

      // Guests count changed
      if (typeof before.guests === 'number' && typeof updatedReservation.guests === 'number' && before.guests !== updatedReservation.guests) {
        events.push({
          type: "GUESTS_UPDATED",
          description: `Guests updated from ${before.guests} to ${updatedReservation.guests} on ${nowWhen}`,
        });
      }

      // Entrances changed per category
      const entranceFields = ["adult", "child", "pwdSenior"];
      const entranceChanges = [];
      for (const k of entranceFields) {
        const prev = before?.entrances?.[k] ?? 0;
        const next = updatedReservation?.entrances?.[k] ?? prev;
        if (prev !== next) entranceChanges.push(`${k} ${prev}->${next}`);
      }
      if (entranceChanges.length) {
        events.push({
          type: "ENTRANCES_UPDATED",
          description: `Entrances updated (${entranceChanges.join(', ')}) on ${nowWhen}`,
        });
      }

      // Accommodation changed
      const beforeAccId = String(before.accommodationId || '') || '';
      const afterAccId = String(updatedReservation.accommodationId || '') || '';
      if (beforeAccId && afterAccId && beforeAccId !== afterAccId) {
        try {
          const [oldAcc, newAcc] = await Promise.all([
            Accommodations.findById(before.accommodationId).select('name').lean(),
            Accommodations.findById(updatedReservation.accommodationId).select('name').lean(),
          ]);
          const oldName = oldAcc?.name || 'Previous accommodation';
          const newName = newAcc?.name || 'New accommodation';
          events.push({
            type: "ACCOMMODATION_CHANGED",
            description: `Accommodation changed from ${oldName} to ${newName} on ${nowWhen}`,
          });
        } catch (e) {
          // If fetch fails, still record change without names
          events.push({
            type: "ACCOMMODATION_CHANGED",
            description: `Accommodation changed on ${nowWhen}`,
          });
        }
      }

      // User details updated
      const prevUser = before.userData || {};
      const nextUser = updatedReservation.userData || {};
      const userChanges = [];
      if ((prevUser.firstName || '') !== (nextUser.firstName || '')) userChanges.push(`first name "${prevUser.firstName || ''}"->"${nextUser.firstName || ''}"`);
      if ((prevUser.lastName || '') !== (nextUser.lastName || '')) userChanges.push(`last name "${prevUser.lastName || ''}"->"${nextUser.lastName || ''}"`);
      if ((prevUser.emailAddress || '') !== (nextUser.emailAddress || '')) userChanges.push(`email ${prevUser.emailAddress || ''}->${nextUser.emailAddress || ''}`);
      if ((prevUser.phoneNumber || '') !== (nextUser.phoneNumber || '')) userChanges.push(`phone ${prevUser.phoneNumber || ''}->${nextUser.phoneNumber || ''}`);
      if (userChanges.length) {
        events.push({
          type: "USER_UPDATED",
          description: `Guest details updated (${userChanges.join(', ')}) on ${nowWhen}`,
        });
      }

      // Walk-in flag changed
      const prevWalk = !!before.isWalkIn;
      const nextWalk = !!updatedReservation.isWalkIn;
      if (prevWalk !== nextWalk) {
        events.push({
          type: "WALKIN_UPDATED",
          description: `Walk-in set to ${nextWalk ? 'TRUE' : 'FALSE'} on ${nowWhen}`,
        });
      }
      if (!events.length) {
        events.push({ type: "ACTIVITY", description: `Reservation updated on ${nowWhen}` });
      }

      for (const ev of events) {
        await activityServices.createActivity({
          reservationId,
          type: ev.type,
          createdAt: updatedReservation.updatedAt,
          description: ev.description,
        });
      }
    } catch (e) {
      console.error("Failed to record reservation update activity:", e?.message);
    }
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
          mode: reservation.mode,
          isDayMode: reservation.isDayMode,
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
          const night = isNightBooking({
            mode: reservation.mode,
            isDayMode: reservation.isDayMode,
            startDate,
            endDate,
          });
          const s = night
            ? getNightDisplayStrings(startDate, endDate).start
            : formatDateInTimeZone(startDate, { includeTime: true });
          const msg = `Reminder: Your reservation ${reservationId} starts tomorrow at ${s}. See you at John Cezar Waterfun Resort!${SMS_FOOTER}`;
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

    // Record activity: reschedule requested
    try {
      const { userData } = reservation.toObject();
      const rr = reservation.rescheduleRequest;
      const requestedWhen = formatDateInTimeZone(rr.requestedAt, { includeTime: true });
      const firstName = userData?.firstName || "Unknown";
      const lastName = userData?.lastName || "";
      const oldStart = rr.oldStartDate ? formatDateInTimeZone(rr.oldStartDate, { includeTime: true }) : "";
      const oldEnd = rr.oldEndDate ? formatDateInTimeZone(rr.oldEndDate, { includeTime: true }) : "";
      const newStartStr = rr.newStartDate ? formatDateInTimeZone(rr.newStartDate, { includeTime: true }) : "";
      const newEndStr = rr.newEndDate ? formatDateInTimeZone(rr.newEndDate, { includeTime: true }) : "";
      await activityServices.createActivity({
        reservationId,
        type: "RESCHEDULE_REQUESTED",
        createdAt: rr.requestedAt,
        description: `${firstName} ${lastName} requested to reschedule from ${oldStart}–${oldEnd} to ${newStartStr}–${newEndStr} on ${requestedWhen}`.trim(),
      });
    } catch (e) {
      console.error("Failed to record reschedule request activity:", e?.message);
    }

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
        const night = isNightBooking({
          mode: reservation.mode,
          isDayMode: reservation.isDayMode,
          startDate: newStart,
          endDate: newEnd,
        });
        const { start: s, end: e } = night
          ? getNightDisplayStrings(newStart, newEnd)
          : { start: formatDateInTimeZone(newStart, { includeTime: true }), end: formatDateInTimeZone(newEnd, { includeTime: true }) };
        const msg = `Reschedule request received: ${reservationId}\nNew: ${s} to ${e}.\nWe will update you soon.${SMS_FOOTER}`;
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

    // Record activity: reschedule decision
    try {
      const rr = reservation.rescheduleRequest;
      const decidedWhen = formatDateInTimeZone(rr.decidedAt, { includeTime: true });
      await activityServices.createActivity({
        reservationId,
        type: "RESCHEDULE_DECIDED",
        createdAt: rr.decidedAt,
        description: `Reschedule request ${String(rr.status).toUpperCase()} on ${decidedWhen}`,
      });
    } catch (e) {
      console.error("Failed to record reschedule decision activity:", e?.message);
    }

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
        const decision = reservation.rescheduleRequest.status;
        const night = isNightBooking({
          mode: reservation.mode,
          isDayMode: reservation.isDayMode,
          startDate: reservation.rescheduleRequest.newStartDate,
          endDate: reservation.rescheduleRequest.newEndDate,
        });
        const { start: s, end: e } = night
          ? getNightDisplayStrings(reservation.rescheduleRequest.newStartDate, reservation.rescheduleRequest.newEndDate)
          : {
            start: formatDateInTimeZone(reservation.rescheduleRequest.newStartDate, { includeTime: true }),
            end: formatDateInTimeZone(reservation.rescheduleRequest.newEndDate, { includeTime: true }),
          };
        const msg = `Reschedule ${decision}: ${reservationId}\n${s} to ${e}${reason ? `\nReason: ${reason}` : ''}${SMS_FOOTER}`;
        await sendSMS({ number: userData.phoneNumber, message: msg });
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

// ============ AMENITIES MANAGEMENT ============ //

const updateReservationAmenitiesById = async (reservationId, { items }) => {

  try {
    if (!Array.isArray(items)) {
      throw new Error("'items' must be an array of { amenityId, quantity }");
    }

    const reservation = await Reservation.findOne({ reservationId });
    if (!reservation) throw new Error("Reservation not found");

    const qtyMap = new Map();
    const amenityIds = [];
    for (const it of items) {
      if (!it || !it.amenityId) continue;
      // Clamp to max 1 per amenity for resort add-ons
      const q = Math.min(1, Number(it.quantity || 0));
      if (q <= 0) continue; // skip zero or negative
      const id = String(it.amenityId);
      qtyMap.set(id, q);
      amenityIds.push(id);
    }

    const docs = amenityIds.length
      ? await Amenities.find({ _id: { $in: amenityIds } }).lean()
      : [];

    // Build line items with current pricing and names
    const lineItems = docs.map((a) => {
      const q = qtyMap.get(String(a._id)) || 0;
      const price = Number(a.price || 0);
      const total = price * q;
      return {
        amenityId: a._id,
        name: a.name,
        price,
        quantity: q,
        total,
      };
    });

    const amenitiesTotal = lineItems.reduce((sum, li) => sum + (li.total || 0), 0);

    // Update reservation amounts
    const beforeAmount = reservation.amount || {};
    const beforeTotal = Number(beforeAmount.total || 0);
    const beforePaid = Number(beforeAmount.totalPaid || 0);

    reservation.amenities = lineItems;

    // Update amenitiesTotal and recompute amount.total.
    // If base components are missing (non-walk-in flows often don't send them),
    // preserve the previously computed aggregate total by adjusting only the amenities delta.
    const accommodationTotal = Number(beforeAmount.accommodationTotal || 0);
    const entranceTotal = Number(beforeAmount.entranceTotal || 0);
    const extraPersonFee = Number(beforeAmount.extraPersonFee || 0);
    const prevAmenitiesTotal = Number(beforeAmount.amenitiesTotal || 0);
    const baseAggregateIsZero = (accommodationTotal + entranceTotal + extraPersonFee) === 0;
    const hasExistingAggregate = Number.isFinite(beforeTotal) && beforeTotal > 0;
    let recomputedTotal;
    const baseMissing = (Number(beforeAmount.accommodationTotal || 0) + Number(beforeAmount.entranceTotal || 0) + Number(beforeAmount.extraPersonFee || 0)) === 0;
    if (baseMissing) {
      try {
        const base = await computeBaseTotals({
          accommodationId: reservation.accommodationId,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          amount: beforeAmount,
          mode: reservation.mode,
          isDayMode: reservation.isDayMode,
        });
        const mergedAmount = {
          ...beforeAmount,
          accommodationTotal: Number(base.accommodationTotal || 0),
          entranceTotal: Number(base.entranceTotal || 0),
          extraPersonFee: Number(base.extraPersonFee || 0),
        };
        recomputedTotal = recomputeTotal({ amount: mergedAmount, nextAmenitiesTotal: amenitiesTotal, preserveWhenBaseMissing: false });
      } catch (e) {
        // Fallback to preservation logic if computing base fails
        recomputedTotal = recomputeTotal({ amount: beforeAmount, nextAmenitiesTotal: amenitiesTotal, preserveWhenBaseMissing: true });
      }
    } else {
      recomputedTotal = recomputeTotal({ amount: beforeAmount, nextAmenitiesTotal: amenitiesTotal, preserveWhenBaseMissing: false });
    }

    reservation.amount = {
      ...beforeAmount,
      amenitiesTotal,
      total: recomputedTotal,
    };

    const saved = await reservation.save();

    // Record activity for amenities change
    try {
      const when = formatDateInTimeZone(new Date(), { includeTime: true });
      const summary = lineItems.length
        ? lineItems.map((li) => `${li.name} x${li.quantity}${li.price ? ` (₱${li.price})` : ''}`).join(', ')
        : 'none';
      await activityServices.createActivity({
        reservationId,
        type: "ACTIVITY",
        description: `Amenities updated: ${summary} on ${when}`,
        createdAt: new Date(),
      });

      // Detect fully paid crossing due to total change
      const afterTotal = Number(saved.amount?.total || 0);
      const wasFullyPaid = beforeTotal > 0 && beforePaid >= beforeTotal;
      const isNowFullyPaid = afterTotal > 0 && beforePaid >= afterTotal;
      if (!wasFullyPaid && isNowFullyPaid) {
        await activityServices.createActivity({
          reservationId,
          type: "PAYMENT_FULLY_PAID",
          description: `Reservation is now FULLY PAID (${beforePaid}/${afterTotal}) on ${when}`,
          createdAt: new Date(),
        });
      } else if (beforeTotal !== afterTotal) {
        await activityServices.createActivity({
          reservationId,
          type: "PAYMENT_UPDATED",
          description: `Payment updated: ${beforePaid}/${afterTotal} on ${when}`,
          createdAt: new Date(),
        });
      }
    } catch (e) {
      console.error("Failed to record amenities update activity:", e?.message);
    }

    return saved;
  } catch (error) {
    console.error("Error updating reservation amenities:", error);
    throw new Error(error.message || "Failed to update amenities for reservation");
  }
};

export default {
  hasDateConflict,
  getExistingReservationByRange,
  createReservation,
  getReservationsByQuery,
  getSingleReservationById,
  updateReservationById,
  updateReservationAmenitiesById,
  deleteReservationById,
  checkAndUpdateReservationStatus,
  sendUpcomingReservationReminders,
  requestRescheduleById,
  decideRescheduleById,
}