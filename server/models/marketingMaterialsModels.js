import mongoose from "mongoose";

const marketingMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    attachments: [
      {
        fileSource: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MarketingMaterials", marketingMaterialSchema);
