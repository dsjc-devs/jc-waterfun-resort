import MarketingMaterials from "../models/marketingMaterialsModels.js";

const createMarketingMaterial = async (materialData) => {
  const { title, content, attachments } = materialData || {};

  try {
    const marketingMaterial = await MarketingMaterials.create({
      title,
      content,
      attachments,
    });

    return `Marketing material with ID ${marketingMaterial._id} successfully created.`;
  } catch (error) {
    console.error("Error creating marketing material:", error.message);
    throw new Error(error);
  }
};

const getMarketingMaterials = async (queryObject) => {
  try {
    const page = parseInt(queryObject.page) || 1;
    const limit = parseInt(queryObject.limit) || 10;
    const skip = (page - 1) * limit;

    const { page: _page, limit: _limit, ...filters } = queryObject;

    const marketingMaterials = await MarketingMaterials.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await MarketingMaterials.countDocuments(filters);

    return {
      marketingMaterials,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalMaterials: totalCount,
    };
  } catch (error) {
    console.error("Error fetching marketing materials:", error.message);
    throw new Error(error);
  }
};

const getSingleMarketingMaterialById = async (materialId) => {
  try {
    const marketingMaterial = await MarketingMaterials.findOne({
      _id: materialId,
    });

    if (!marketingMaterial) {
      throw new Error("Marketing material not found");
    }

    return marketingMaterial;
  } catch (error) {
    console.error("Error fetching marketing material:", error.message);
    throw new Error(error);
  }
};

const updateMarketingMaterialById = async (materialId, updateData) => {
  try {
    const allowedFields = ["title", "content", "views", "attachments"];
    const updates = {};

    for (const key of allowedFields) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }

    const updatedMaterial = await MarketingMaterials.findOneAndUpdate(
      { _id: materialId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      throw new Error("Marketing material not found");
    }

    return `Marketing material with ID ${materialId} successfully updated.`;
  } catch (error) {
    console.error("Error updating marketing material:", error.message);
    throw new Error(error);
  }
};

const deleteMarketingMaterialById = async (materialId) => {
  try {
    const marketingMaterial = await getSingleMarketingMaterialById(materialId);
    const deletedMaterial = await MarketingMaterials.findOneAndDelete({
      _id: marketingMaterial._id,
    });

    if (!deletedMaterial) {
      throw new Error("Marketing material not found");
    }

    return `Marketing material with ID ${deletedMaterial._id} successfully deleted.`;
  } catch (error) {
    console.error("Error deleting marketing material:", error.message);
    throw new Error(error);
  }
};

export default {
  createMarketingMaterial,
  getMarketingMaterials,
  getSingleMarketingMaterialById,
  updateMarketingMaterialById,
  deleteMarketingMaterialById,
};
