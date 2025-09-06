import mongoose from "mongoose";

const attachcmentSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  attachment: {
    type: String,
    required: true
  }
})

const marketingMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["POSTED", "UNPUBLISHED", "ARCHIVED"],
      default: "POSTED",
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    attachments: {
      type: [attachcmentSchema],
      required: true
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MarketingMaterials", marketingMaterialSchema);
