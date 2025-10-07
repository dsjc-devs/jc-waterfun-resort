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
  // If null/undefined, it's a global block affecting all accommodations
  // If set, it only affects the specific accommodation
  accommodationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accommodations",
    required: false,
    default: null
  },
  // Type of block: 'global' affects all, 'accommodation' affects specific one
  blockType: {
    type: String,
    enum: ["global", "accommodation"],
    default: "global"
  }
}, {
  timestamps: true
});

export default mongoose.model("BlockedDate", blockedDatesSchema);