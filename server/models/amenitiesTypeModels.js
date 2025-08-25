import mongoose from "mongoose";
import textFormatter from "../utils/textFormatter.js";

const amenitiesTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

amenitiesTypeSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = textFormatter.toSlug(this.name);
  }
  next();
});

const AmenitiesType = mongoose.model("AmenitiesType", amenitiesTypeSchema);

async function seedAmenitiesTypes() {
  const count = await AmenitiesType.countDocuments();
  if (count === 0) {
    const amenitiesTypes = [
      { name: "Swimming Pool" },
      { name: "Billiards" },
      { name: "Karaoke" },
    ];
    await AmenitiesType.insertMany(amenitiesTypes);
    console.log("Default amenities types inserted");
  }
}

seedAmenitiesTypes().catch(console.error);

export default AmenitiesType;