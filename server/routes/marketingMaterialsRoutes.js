import express from "express";
import {
  createMarketingMaterial,
  getMarketingMaterials,
  getSingleMarketingMaterialById,
  updateMarketingMaterialById,
  deleteMarketingMaterialById,
} from "../controllers/marketingMaterialsControllers.js";

const router = express.Router();

router.post("/create", createMarketingMaterial);
router.get("/", getMarketingMaterials);
router.get("/:materialId", getSingleMarketingMaterialById);
router.patch("/:materialId", updateMarketingMaterialById);
router.delete("/:materialId", deleteMarketingMaterialById);

export default router;