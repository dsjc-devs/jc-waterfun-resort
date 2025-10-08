import Gallery from "../models/galleryModels.js";

const createGalleryImage = async (galleryData) => {
  const { image, category } = galleryData || {};

  try {
    if (!image || image.trim() === "") {
      throw new Error("Image is required and cannot be empty");
    }

    if (!category || category.trim() === "") {
      throw new Error("Category is required and cannot be empty");
    }

    const payload = {
      image,
      category,
    };

    const galleryImage = await Gallery.create(payload);

    return {
      message: "Gallery image created successfully",
      data: galleryImage
    };
  } catch (error) {
    console.error("Error creating gallery image:", error.message);
    throw new Error(error);
  }
};

const createMultipleGalleryImages = async (imageFiles, category) => {
  try {
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error("At least one image file is required");
    }

    if (!category || category.trim() === "") {
      throw new Error("Category is required and cannot be empty");
    }

    const galleryImages = [];
    const errors = [];

    // Process each image file
    for (let i = 0; i < imageFiles.length; i++) {
      try {
        const imageFile = imageFiles[i];
        const payload = {
          image: imageFile.path,
          category: category.trim(),
        };

        const galleryImage = await Gallery.create(payload);
        galleryImages.push(galleryImage);
      } catch (error) {
        console.error(`Error creating gallery image ${i + 1}:`, error.message);
        errors.push(`Image ${i + 1}: ${error.message}`);
      }
    }

    if (galleryImages.length === 0) {
      throw new Error(`Failed to create any images. Errors: ${errors.join(', ')}`);
    }

    const successCount = galleryImages.length;
    const totalCount = imageFiles.length;
    const message = successCount === totalCount
      ? `${successCount} gallery images created successfully`
      : `${successCount} out of ${totalCount} gallery images created successfully`;

    return {
      message,
      data: galleryImages,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error("Error creating multiple gallery images:", error.message);
    throw new Error(error);
  }
};

const getAllGalleryImages = async (queryObject) => {
  try {
    const { page: _page, limit: _limit, ...filters } = queryObject;
    const filterObj = Object.keys(filters).length === 0 ? {} : filters;

    let galleryImages, totalCount, totalPages, currentPage;

    if (!queryObject.page && !queryObject.limit) {
      // No pagination, return all
      galleryImages = await Gallery.find(filterObj).sort({ createdAt: -1 });
      totalCount = galleryImages.length;
      totalPages = 1;
      currentPage = 1;
    } else {
      // Paginated
      const page = parseInt(queryObject.page) || 1;
      const limit = parseInt(queryObject.limit) || 10;
      const skip = (page - 1) * limit;

      galleryImages = await Gallery.find(filterObj)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      totalCount = await Gallery.countDocuments(filterObj);
      totalPages = Math.ceil(totalCount / limit);
      currentPage = page;
    }

    return {
      galleryImages,
      totalPages,
      currentPage,
      totalImages: totalCount,
    };
  } catch (error) {
    console.error("Error fetching gallery images:", error.message);
    throw new Error(error);
  }
};

const getSingleGalleryImageById = async (galleryId) => {
  try {
    const galleryImage = await Gallery.findOne({ _id: galleryId });

    if (!galleryImage) {
      throw new Error("Gallery image not found");
    }

    return galleryImage;
  } catch (error) {
    console.error("Error fetching gallery image:", error.message);
    throw new Error(error);
  }
};

const updateGalleryImageById = async (galleryId, galleryData) => {
  try {
    const { image, category } = galleryData || {};

    const existingGalleryImage = await getSingleGalleryImageById(galleryId);

    const updateData = {};
    if (image !== undefined && image !== null) {
      if (image.trim() === "") {
        throw new Error("Image cannot be empty");
      }
      updateData.image = image;
    }
    if (category !== undefined) {
      if (category.trim() === "") {
        throw new Error("Category cannot be empty");
      }
      updateData.category = category;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("At least one field must be provided for update");
    }

    const updatedGalleryImage = await Gallery.findOneAndUpdate(
      { _id: galleryId },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      message: "Gallery image updated successfully",
      data: updatedGalleryImage
    };
  } catch (error) {
    console.error("Error updating gallery image:", error.message);
    throw new Error(error);
  }
};

const deleteGalleryImageById = async (galleryId) => {
  try {
    const galleryImage = await getSingleGalleryImageById(galleryId);
    const deletedGalleryImage = await Gallery.findOneAndDelete({ _id: galleryImage._id });

    return `Gallery image with ID ${deletedGalleryImage._id} deleted successfully`;
  } catch (error) {
    console.error("Error deleting gallery image:", error.message);
    throw new Error("Failed to delete gallery image");
  }
};

export default {
  createGalleryImage,
  createMultipleGalleryImages,
  getAllGalleryImages,
  getSingleGalleryImageById,
  updateGalleryImageById,
  deleteGalleryImageById,
};
