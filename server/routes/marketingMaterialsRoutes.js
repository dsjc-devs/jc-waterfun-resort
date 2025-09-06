import express from "express";
import {
  createMarketingMaterial,
  getMarketingMaterials,
  getSingleMarketingMaterialById,
  updateMarketingMaterialById,
  deleteMarketingMaterialById,
} from "../controllers/marketingMaterialsControllers.js";
import createUploadMiddleware from '../middleware/multer/uploadMiddleware.js'

const router = express.Router();

router.post(
  "/create",
  createUploadMiddleware({
    fields: [
      { name: 'thumbnail', maxCount: 1 },
      { name: 'attachments', maxCount: 2 }
    ],
    fieldFolders: {
      thumbnail: 'marketing_materials/thumbnails',
      attachments: 'marketing_materials/attachments'
    }
  }),
  createMarketingMaterial
);
router.get("/", getMarketingMaterials);
router.get("/:materialId", getSingleMarketingMaterialById);
router.patch(
  "/:materialId",
  createUploadMiddleware({
    fields: [
      { name: 'thumbnail', maxCount: 1 },
      { name: 'attachments', maxCount: 2 }
    ],
    fieldFolders: {
      thumbnail: 'marketing_materials/thumbnails',
      attachments: 'marketing_materials/attachments'
    }
  }),
  updateMarketingMaterialById
);
router.delete("/:materialId", deleteMarketingMaterialById);

export default router;