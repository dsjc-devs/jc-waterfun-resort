import mongoose from "mongoose";
import { RESORT_DETAILS } from "../constants/constants.js";

const resortDetailsSchema = new mongoose.Schema(
  {
    aboutUs: {
      mission: { type: String, default: RESORT_DETAILS.aboutUs.mission },
      vision: { type: String, default: RESORT_DETAILS.aboutUs.vision },
      goals: { type: String, default: RESORT_DETAILS.aboutUs.goals },
    },
    companyInfo: {
      logo: { type: String, default: RESORT_DETAILS.companyInfo.logo },
      name: { type: String, default: RESORT_DETAILS.companyInfo.name },
      emailAddress: {
        type: String,
        default: RESORT_DETAILS.companyInfo.emailAddress,
      },
      phoneNumber: {
        type: String,
        default: RESORT_DETAILS.companyInfo.phoneNumber,
      },
      address: {
        streetAddress: {
          type: String,
          default: RESORT_DETAILS.companyInfo.address.streetAddress,
        },
        city: {
          type: String,
          default: RESORT_DETAILS.companyInfo.address.city,
        },
        province: {
          type: String,
          default: RESORT_DETAILS.companyInfo.address.province,
        },
        country: {
          type: String,
          default: RESORT_DETAILS.companyInfo.address.country,
        },
      },
    },
    companyHashtag: {
      type: String,
      default: RESORT_DETAILS.companyHashtag
    },
  },
  { timestamps: true }
);

const ResortDetails = mongoose.model("ResortDetails", resortDetailsSchema);

export default ResortDetails;
