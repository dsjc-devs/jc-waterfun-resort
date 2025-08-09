import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createResortDetails,
  getResortDetails,
  updateResortDetails,
} from "../controllers/resortDetailsControllers.js";
import createUploadMiddleware from "../middleware/multer/uploadMiddleware.js";

const router = express.Router();
router.post(
  "/create",
  protect,
  createUploadMiddleware({
    fields: [{ name: "logo", maxCount: 1 }],
    fieldFolders: {
      logo: "resort_logos",
    },
  }),
  createResortDetails
);

router.get("/", getResortDetails);

router.patch(
  "/", // Remove /:resortId
  protect,
  createUploadMiddleware({
    fields: [{ name: "logo", maxCount: 1 }],
    fieldFolders: {
      logo: "resort_logos",
    },
  }),
  updateResortDetails
);

export default router;
