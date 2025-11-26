import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createActivity, getActivities } from '../controllers/activityControllers.js';

const router = express.Router();

router.get('/', protect, getActivities);
router.post('/', protect, createActivity);

export default router;
