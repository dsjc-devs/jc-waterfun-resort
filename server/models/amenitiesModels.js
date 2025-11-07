import mongoose from "mongoose";
import AmenitiesType from "./amenitiesTypeModels.js";

const picturesSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

const amenitiesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    pictures: {
      type: [picturesSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one picture is required",
      },
    },
    type: {
      type: String,
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await AmenitiesType.exists({ slug: value });
          return exists;
        },
        message: (props) => `${props.value} is not a valid amenities type`,
      },
    },
    description: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["POSTED", "ARCHIVED", "UNPOSTED"],
      default: "POSTED",
    },
    hasPrice: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Amenities = mongoose.model("Amenities", amenitiesSchema);

export default Amenities;