import mongoose from "mongoose";

const blockedDatesSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: false,
  },
});

export default mongoose.model("BlockedDate", blockedDatesSchema);