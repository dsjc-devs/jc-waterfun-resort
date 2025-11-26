import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: [
        "ACTIVITY",
        "RESERVATION_CREATED",
        "SCHEDULE_UPDATED",
        "STATUS_UPDATED",
        "PAYMENT_UPDATED",
        "PAYMENT_FULLY_PAID",
        "RESCHEDULE_REQUESTED",
        "RESCHEDULE_DECIDED",
        "GUESTS_UPDATED",
        "ENTRANCES_UPDATED",
        "ACCOMMODATION_CHANGED",
        "USER_UPDATED",
        "WALKIN_UPDATED",
      ],
      default: "ACTIVITY",
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
)

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;