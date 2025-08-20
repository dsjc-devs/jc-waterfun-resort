import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
