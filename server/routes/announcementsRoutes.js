import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createAnnouncement,
  getAllAnnouncements,
  getSingleAnnouncementById,
  updateAnnouncementById,
  deleteAnnouncementById,
} from "../controllers/announcementsControllers.js";
import createUploadMiddleware from "../middleware/multer/uploadMiddleware.js";

const router = express.Router();

router.post(
  '/', 
  protect, 
  createUploadMiddleware({
    fields: [{ name: "attachments", maxCount: 1 }],
    fieldFolders: {
      attachments: "announcements_attachments",
    },
  }),
  createAnnouncement
);
router.get('/', getAllAnnouncements);
router.get('/:announcementId', getSingleAnnouncementById);
router.patch(
  '/:announcementId', 
  protect, 
  createUploadMiddleware({
    fields: [{ name: "attachments", maxCount: 1 }],
    fieldFolders: {
      attachments: "announcements_attachments",
    },
  }),
  updateAnnouncementById
);
router.delete('/:announcementId', protect, deleteAnnouncementById);

export default router;
