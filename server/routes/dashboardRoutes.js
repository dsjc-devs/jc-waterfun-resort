import express from 'express';
import {
  getDashboardStatistics,
  getUserDashboardStatistics,
  getDetailedDashboardStatistics,
  getRecentActivityStatistics,
  getMonthlyStatistics,
  getDashboardOverview
} from '../controllers/dashboardControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', getDashboardStatistics);
router.get('/customer-stats', protect, getUserDashboardStatistics);
router.get('/detailed-stats', getDetailedDashboardStatistics);
router.get('/recent-activity', getRecentActivityStatistics);
router.get('/monthly-stats', getMonthlyStatistics);
router.get('/overview', getDashboardOverview);

export default router;