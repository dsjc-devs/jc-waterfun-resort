import mongoose from "mongoose";

const tempBookingSchema = new mongoose.Schema(
  {
    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    accommodationId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    entrances: {
      adult: { type: Number, default: 0 },
      child: { type: Number, default: 0 },
      pwdSenior: { type: Number, default: 0 },
    },
    amount: {
      extraPersonFee: { type: Number, default: 0 },
      accommodationTotal: { type: Number, required: true },
      entranceTotal: { type: Number, default: 0 },
      amenitiesTotal: { type: Number, default: 0 },
      total: { type: Number, required: true },
      minimumPayable: { type: Number, required: true },
      totalPaid: { type: Number, required: true },
      adult: { type: Number, default: 0 },
      child: { type: Number, default: 0 },
      pwdSenior: { type: Number, default: 0 },
    },
    amenitiesItems: [
      new mongoose.Schema(
        {
          amenityId: { type: mongoose.Schema.Types.ObjectId, ref: "Amenities", required: true },
          quantity: { type: Number, default: 0 },
        },
        { _id: false }
      )
    ],
    paymentMethod: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 3600 // Expires after 1 hour
    }
  },
  { timestamps: true }
);

const TempBooking = mongoose.model("TempBooking", tempBookingSchema);

export default TempBooking;