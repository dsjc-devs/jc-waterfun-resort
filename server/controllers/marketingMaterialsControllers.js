import expressAsnc from "express-async-handler";
import marketingMaterialsServices from "../services/marketingMaterialsServices.js";

const createMarketingMaterial = expressAsnc(async (req, res) => {
  try {
    const response = await marketingMaterialsServices.createMarketingMaterial(
      req.body
    );
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
  try {
    const response =
      await marketingMaterialsServices.updateMarketingMaterialById(
        req.params.materialId,
        req.body
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

export {
  createMarketingMaterial,
  getMarketingMaterials,
  getSingleMarketingMaterialById,
  updateMarketingMaterialById,
  deleteMarketingMaterialById,
};
