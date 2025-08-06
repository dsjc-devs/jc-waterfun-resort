import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
    {
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
            required: true
        },
        phoneNumber: {
            type: String,
            required: false,
            maxlength: 11
        },
        subject: {
            type: String,
            required: true
        },
        remarks: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);



export default mongoose.model("ContactUs", contactUsSchema);    