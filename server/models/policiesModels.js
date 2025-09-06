import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["privacy", "terms", "no_cancellation"],
      required: true,
    },
  },
  { 
    timestamps: true 
}
);

const Policy = mongoose.model("Policy", policySchema);

export default Policy;
