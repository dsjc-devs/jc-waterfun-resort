import dashboardServices from '../services/dashboardServices.js';

const getDashboardStatistics = async (req, res) => {
  try {
    const stats = await dashboardServices.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserDashboardStatistics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = await dashboardServices.getUserDashboardStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDetailedDashboardStatistics = async (req, res) => {
  try {
    const stats = await dashboardServices.getDetailedDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getRecentActivityStatistics = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNumber = parseInt(days, 10);

    if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
      return res.status(400).json({
        success: false,
        message: 'Days parameter must be a number between 1 and 365'
      });
    }

    const stats = await dashboardServices.getRecentActivityStats(daysNumber);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMonthlyStatistics = async (req, res) => {
  try {
    const stats = await dashboardServices.getMonthlyStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDashboardOverview = async (req, res) => {
  try {
    const [basicStats, recentActivity, monthlyStats] = await Promise.all([
      dashboardServices.getDashboardStats(),
      dashboardServices.getRecentActivityStats(7),
      dashboardServices.getMonthlyStats()
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

export {
  getDashboardStatistics,
  getUserDashboardStatistics,
  getDetailedDashboardStatistics,
  getRecentActivityStatistics,
  getMonthlyStatistics,
  getDashboardOverview
};