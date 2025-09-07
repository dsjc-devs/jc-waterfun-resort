import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      short: { type: String, required: true },
      long: { type: String, required: true },
    },
    attachments: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
