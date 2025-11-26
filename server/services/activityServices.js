import Activity from "../models/activityModel.js";
import Reservation from "../models/reservationsModels.js";
import { formatDateInTimeZone } from "../utils/formatDate.js";

const createActivity = async (data = {}) => {
  try {
    const payload = {
      reservationId: data?.reservationId || undefined,
      type: data?.type || "ACTIVITY",
      description: data?.description || "",
    };
    if (data?.createdAt) payload.createdAt = data.createdAt;
    const activity = await Activity.create(payload);
    return activity;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw new Error(error.message || "Failed to create activity");
  }
};

const getActivities = async ({ reservationId = '' } = {}) => {

  try {
    // Fetch persisted activities for this reservation only
    const activities = await Activity.find({ reservationId })
      .sort({ createdAt: -1 })
      .lean();

    const activityEntries = activities.map((a) => ({
      type: a?.type || "ACTIVITY",
      reservationId: a?.reservationId,
      createdAt: a?.createdAt,
      updatedAt: a?.updatedAt,
      description: a?.description,
      _id: a?._id,
    }));

    // If no activities stored OR none with type RESERVATION_CREATED, seed a synthetic 'reservation created'
    const hasCreated = activityEntries.some((e) => e.type === "RESERVATION_CREATED");
    if (activityEntries.length === 0 || !hasCreated) {
      const r = await Reservation.findOne({ reservationId })
        .select("reservationId userData createdAt")
        .lean();
      if (r) {
        const firstName = r?.userData?.firstName || "Unknown";
        const lastName = r?.userData?.lastName || "";
        const createdWhen = formatDateInTimeZone(r.createdAt, { includeTime: true });
        activityEntries.push({
          type: "RESERVATION_CREATED",
          reservationId: r.reservationId,
          createdAt: r.createdAt,
          description: `${firstName} ${lastName} of the customer booked a reservation on ${createdWhen}`.trim(),
        });
      }
    }

    return activityEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw new Error(error.message || "Failed to fetch activities");
  }
};

export default {
  createActivity,
  getActivities,
};
