import mongoose from "mongoose";

const quantitiesSchema = new mongoose.Schema(
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
    total: { type: Number, required: true },
    totalPaid: { type: Number, required: true },
    adult: { type: Number, default: 0 },
    child: { type: Number, default: 0 },
    pwdSenior: { type: Number, default: 0 },
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
    quantities: quantitiesSchema,
    amount: amountSchema,
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
