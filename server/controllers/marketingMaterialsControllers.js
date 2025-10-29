import expressAsnc from "express-async-handler";
import marketingMaterialsServices from "../services/marketingMaterialsServices.js";

const createMarketingMaterial = expressAsnc(async (req, res) => {
  const thumbnail = req.files?.['thumbnail']?.[0]?.path || "";

  if (req.files?.attachments) {
    req.body.attachments = req.files.attachments.map(file => ({
      fileName: file.originalname,
      attachment: file.path
    }));
  }

  try {
    const response = await marketingMaterialsServices.createMarketingMaterial({ thumbnail, ...req.body });
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getMarketingMaterials = expressAsnc(async (req, res) => {
  try {
    const response = await marketingMaterialsServices.getMarketingMaterials(
      req.query
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const getSingleMarketingMaterialById = expressAsnc(async (req, res) => {
  try {
    const response =
      await marketingMaterialsServices.getSingleMarketingMaterialById(
        req.params.materialId
      );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const updateMarketingMaterialById = expressAsnc(async (req, res) => {
  let updateData = { ...req.body };

  if (req.files?.['thumbnail']?.[0]?.path) {
    updateData.thumbnail = req.files['thumbnail'][0].path;
  } else if (req.body.thumbnailUrl) {
    updateData.thumbnail = req.body.thumbnailUrl;
  }

  if (req.files?.attachments) {
    updateData.attachments = req.files.attachments.map(file => ({
      fileName: file.originalname,
      attachment: file.path
    }));
  }

  try {
    const response =
      await marketingMaterialsServices.updateMarketingMaterialById(
        req.params.materialId,
        updateData
      );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteMarketingMaterialById = expressAsnc(async (req, res) => {
  try {
    const response =
      await marketingMaterialsServices.deleteMarketingMaterialById(
        req.params.materialId
      );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

const incrementViewById = expressAsnc(async (req, res) => {
  try {
    const response = await marketingMaterialsServices.incrementViewById(
      req.params.materialId
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export {
  createMarketingMaterial,
  getMarketingMaterials,
  getSingleMarketingMaterialById,
  updateMarketingMaterialById,
  deleteMarketingMaterialById,
  incrementViewById,
};
