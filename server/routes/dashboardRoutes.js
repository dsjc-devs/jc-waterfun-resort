import express from 'express';
import {
  getRoleBasedDashboard,
  getFinancialAnalytics
} from '../controllers/dashboardControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getRoleBasedDashboard);

router.get('/financial-analytics', getFinancialAnalytics);

export default router;