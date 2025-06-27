import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {   
        testimonialId: {
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
        required: true
        },
        remarks: {
        type: String,
        required: true,
        },
        rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
        },
        isPosted: {
        type: Boolean,
        default: false
        }
    },
    {
        timestamps: true
    }
    );

    export default mongoose.model("Testimonials", testimonialSchema);