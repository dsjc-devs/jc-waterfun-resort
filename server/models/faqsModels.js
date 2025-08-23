import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["POSTED", "UNPUBLISHED", "ARCHIVED"],
      default: "POSTED",
    },
    category: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
