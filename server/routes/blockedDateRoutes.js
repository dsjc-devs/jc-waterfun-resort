import express from "express";
import {
  createBlockedDate,
  getAllBlockedDates,
  getBlockedDateById,
  updateBlockedDate,
  deleteBlockedDate,
} from '../controllers/blockedDatesControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBlockedDate);
router.get('/', getAllBlockedDates);
router.get('/:id', getBlockedDateById);
router.put('/:id', protect, updateBlockedDate);
router.delete('/:id', protect, deleteBlockedDate);

export default router;