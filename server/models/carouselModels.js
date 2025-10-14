import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: '',
    },
    isPosted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);

export default Carousel;