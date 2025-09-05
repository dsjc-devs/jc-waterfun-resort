import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);

export default Carousel;