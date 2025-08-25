import mongoose from "mongoose";
import textFormatter from "../utils/textFormatter.js";

const accommodationTypeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true
  }
);

accommodationTypeSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = textFormatter.toSlug(this.title);
  }
  next();
});

const AccommodationType = mongoose.model("AccommodationType", accommodationTypeSchema);

async function seedAccomodations() {
  const count = await AccommodationType.countDocuments();
  if (count === 0) {
    await AccommodationType.insertMany([
      { title: "Room" },
      { title: "Event Hall" },
      { title: "Cottage" },
      { title: "Guest House" },
    ]);
    console.log("Default accommodation types inserted");
  }
}

seedAccomodations().catch(console.error);

export default AccommodationType;
