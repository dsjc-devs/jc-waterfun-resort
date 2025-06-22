import mongoose from "mongoose";
import { USER_STATUSSES } from '../constants/constants.js'

const positionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    _id: false,
    timestamps: false,
  }
);

const usersSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true
    },
    avatar: {
      type: String
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    status: {
      type: String,
      required: true,
      enum: USER_STATUSSES
    },
    position: {
      type: [positionSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one position object is required."
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Users", usersSchema);
