import mongoose from "mongoose";
import AccomodationType from './accommodationTypeModels.js'

const priceSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true
    },
    night: {
      type: Number,
      required: true
    },
  }
)

const picturesSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },
  },
  {
    timestamps: false
  }
)

const accommodationsSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      required: true,
    },
    pictures: {
      type: [picturesSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one picture is required"
      }
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    extraPersonFee: {
      type: Number,
    },
    price: {
      type: priceSchema,
      required: true
    },
    maxStayDuration: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["POSTED", "ARCHIVED", "UNPOSTED"],
      default: "POSTED"
    },
    type: {
      type: String,
      required: true,
      validate: {
        validator: async function (value) {
          const exists = await AccomodationType.exists({ slug: value });
          return exists;
        },
        message: props => `${props.value} is not a valid accommodation type`
      }
    },
    notes: {
      type: String
    },
    groupKey: {
      type: String
    },
    hasPoolAccess: {
      type: Boolean,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true
  }
)

const Accommodations = new mongoose.model("Accommodations", accommodationsSchema)

export default Accommodations