import Carousel from "../models/carouselModels.js";

const createCarousel = async (carouselData) => {
  const { image, title = '', subtitle = '', isPosted } = carouselData || {};

  try {
    if (!image || image.trim() === "") {
      throw new Error("Image is required and cannot be empty");
    }

    const payload = {
      image,
      title,
      subtitle,
      isPosted: typeof isPosted === 'boolean' ? isPosted : false,
    };

    const carousel = await Carousel.create(payload);

    return {
      message: "Carousel created successfully",
      data: carousel
    };
  } catch (error) {
    console.error("Error creating carousel:", error.message);
    throw new Error(error);
  }
};

const getAllCarousels = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const carousels = await Carousel.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Carousel.countDocuments(filters);

    return {
      carousels,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCarousels: totalCount,
    };
  } catch (error) {
    console.error("Error fetching carousels:", error.message);
    throw new Error(error);
  }
};

const getSingleCarouselById = async (carouselId) => {
  try {
    const carousel = await Carousel.findOne({ _id: carouselId });

    if (!carousel) {
      throw new Error("Carousel not found");
    }

    return carousel;
  } catch (error) {
    console.error("Error fetching carousel:", error.message);
    throw new Error(error);
  }
};

const updateCarouselById = async (carouselId, carouselData) => {
  try {
  const { image, title, subtitle, isPosted } = carouselData || {};

    const existingCarousel = await getSingleCarouselById(carouselId);

    const updateData = {};
    if (image !== undefined && image !== null) {
      if (image.trim() === "") {
        throw new Error("Image cannot be empty");
      }
      updateData.image = image;
    }
    if (title !== undefined) {
      if (title.trim() === "") {
        throw new Error("Title cannot be empty");
      }
      updateData.title = title;
    }
    if (subtitle !== undefined) {
      if (subtitle.trim() === "") {
        throw new Error("Subtitle cannot be empty");
      }
      updateData.subtitle = subtitle;
    }
    if (isPosted !== undefined) {
      if (typeof isPosted !== 'boolean') {
        throw new Error('isPosted must be a boolean value');
      }
      updateData.isPosted = isPosted;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    const updatedCarousel = await Carousel.findOneAndUpdate(
      { _id: carouselId }, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      message: "Carousel updated successfully",
      data: updatedCarousel
    };
  } catch (error) {
    console.error("Error updating carousel:", error.message);
    throw new Error(error);
  }
};

const deleteCarouselById = async (carouselId) => {
  try {
    const carousel = await getSingleCarouselById(carouselId);
    const deletedCarousel = await Carousel.findOneAndDelete({ _id: carousel._id });

    return `Carousel with ID ${deletedCarousel._id} deleted successfully`;
  } catch (error) {
    console.error("Error deleting carousel:", error.message);
    throw new Error("Failed to delete carousel");
  }
};

export default {
  createCarousel,
  getAllCarousels,
  getSingleCarouselById,
  updateCarouselById,
  deleteCarouselById,
};
