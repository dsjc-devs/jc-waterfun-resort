import mongoose from "mongoose";

const resortRatesSchema = new mongoose.Schema(
  {
    entranceFee: {
      adult: {
        day: { type: Number, required: true, default: 150 },
        night: { type: Number, required: true, default: 200 },
      },
      child: {
        day: { type: Number, required: true, default: 100 },
        night: { type: Number, required: true, default: 150 },
      },
      pwdSenior: {
        day: { type: Number, required: true, default: 100 },
        night: { type: Number, required: true, default: 120 },
      },
    },
  },
  {
    timestamps: true,
  }
);

const ResortRates = mongoose.model("ResortRates", resortRatesSchema);

export async function seedResortRates() {
  const count = await ResortRates.countDocuments();
  if (count === 0) {
    await ResortRates.create({
      entranceFee: {
        adult: { day: 150, night: 200 },
        child: { day: 100, night: 150 },
        pwdSenior: { day: 100, night: 120 },
      },
    });
    console.log("Default resort rates inserted");
  }
}

seedResortRates().catch(console.error);

export default ResortRates;
