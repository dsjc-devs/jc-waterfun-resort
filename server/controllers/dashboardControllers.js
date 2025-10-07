import {
  getDashboardStats,
  getUserDashboardStats,
  getDetailedDashboardStats,
  getRecentActivityStats,
  getMonthlyStats
} from '../services/dashboardServices.js';

export const getDashboardStatistics = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserDashboardStatistics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await getUserDashboardStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDetailedDashboardStatistics = async (req, res) => {
  try {
    const stats = await getDetailedDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRecentActivityStatistics = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNumber = parseInt(days, 10);
    
    if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be a number between 1 and 365'
      });
    }

    const stats = await getRecentActivityStats(daysNumber);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMonthlyStatistics = async (req, res) => {
  try {
    const stats = await getMonthlyStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDashboardOverview = async (req, res) => {
  try {
    const [basicStats, recentActivity, monthlyStats] = await Promise.all([
      getDashboardStats(),
      getRecentActivityStats(7),
      getMonthlyStats()
    ]);

    res.status(200).json({
      success: true,
      data: {
        basicStats: basicStats.data,
        recentActivity: recentActivity.data,
        monthlyStats: monthlyStats.data
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};