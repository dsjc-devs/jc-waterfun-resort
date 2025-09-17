import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "PHP",
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    paymentMethodId: {
      type: String,
    },
    redirectUrl: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
