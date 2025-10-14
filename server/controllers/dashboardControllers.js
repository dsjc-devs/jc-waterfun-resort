import dashboardServices from '../services/dashboardServices.js';

const getRoleBasedDashboard = async (req, res) => {
  try {
    // Extract role from authenticated user's token
    if (!req.user || !req.user.position || !req.user.position.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user authentication or missing role information'
      });
    }

    const userRole = req.user.position[0].value;
    const userId = req.user.userId;

    // Extract month and year parameters for admin roles
    const { month, year } = req.query;
    
    // Convert string parameters to numbers if provided
    const monthNumber = month ? parseInt(month, 10) : null;
    const yearNumber = year ? parseInt(year, 10) : null;

    // Validate month parameter
    if (month && (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12)) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter must be a number between 1 and 12'
      });
    }

    // Validate year parameter
    if (year && (isNaN(yearNumber) || yearNumber < 2020 || yearNumber > 2030)) {
      return res.status(400).json({
        success: false,
        message: 'Year parameter must be a valid year between 2020 and 2030'
      });
    }

    // Validate role
    const validRoles = ['MASTER_ADMIN', 'ADMIN', 'RECEPTIONIST', 'CUSTOMER'];
    if (!validRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'User does not have a valid role for dashboard access'
      });
    }

    const stats = await dashboardServices.getRoleBasedDashboardStats(userRole, userId, monthNumber, yearNumber);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Keep existing functions for backward compatibility
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

const getFinancialAnalytics = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Convert string parameters to numbers if provided
    const monthNumber = month ? parseInt(month, 10) : null;
    const yearNumber = year ? parseInt(year, 10) : null;

    // Validate month parameter
    if (month && (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12)) {
      return res.status(400).json({
        success: false,
        message: 'Month parameter must be a number between 1 and 12'
      });
    }

    // Validate year parameter
    if (year && (isNaN(yearNumber) || yearNumber < 2020 || yearNumber > 2030)) {
      return res.status(400).json({
        success: false,
        message: 'Year parameter must be a valid year between 2020 and 2030'
      });
    }

    const analytics = await dashboardServices.getFinancialAnalytics(monthNumber, yearNumber);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getRoleBasedDashboard,
  getDashboardStatistics,
  getFinancialAnalytics
};