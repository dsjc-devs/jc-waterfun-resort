import mongoose from "mongoose";

const entrancesSchema = new mongoose.Schema(
  {
    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    pwdSenior: { type: Number, default: 0 },
  },
  { _id: false }
);

const amountSchema = new mongoose.Schema(
  {
    accommodationTotal: { type: Number, required: true },
    entranceTotal: { type: Number, required: true },
    amenitiesTotal: { type: Number, default: 0 },
    total: { type: Number, required: true },
    totalPaid: { type: Number, required: true },
    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    pwdSenior: { type: Number, default: 0 },
    extraPersonFee: { type: Number, default: 0 },
  },
  { _id: false }
);

const userDataSchema = new mongoose.Schema(
  {
    userId: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailAddress: { type: String },
    phoneNumber: { type: String },
  },
  { _id: false }
)

const reservationSchema = new mongoose.Schema(
  {
    reservationId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String
    },
    userData: {
      type: userDataSchema,
      required: true,
    },
    accommodationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodations",
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
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "RESCHEDULED", "ARCHIVED"],
    },
    rescheduleRequest: {
      oldStartDate: { type: Date },
      oldEndDate: { type: Date },
      newStartDate: { type: Date },
      newEndDate: { type: Date },
      status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
      },
      requestedBy: { type: String },
      requestedAt: { type: Date },
      decidedBy: { type: String },
      decidedAt: { type: Date },
      reason: { type: String },
    },
    isWalkIn: {
      type: Boolean,
      default: false
    },
    entrances: entrancesSchema,
    amenities: [
      new mongoose.Schema(
        {
          amenityId: { type: mongoose.Schema.Types.ObjectId, ref: "Amenities", required: true },
          name: { type: String, required: true },
          price: { type: Number, default: 0 },
          quantity: { type: Number, default: 0 },
          total: { type: Number, default: 0 },
        },
        { _id: false }
      )
    ],
    amount: amountSchema,
    guests: {
      type: Number,
      required: true,
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
