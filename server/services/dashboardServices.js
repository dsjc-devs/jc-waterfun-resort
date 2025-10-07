import Reservations from '../models/reservationsModels.js';
import Accommodations from '../models/accommodationsModels.js';
import Users from '../models/usersModels.js';

export const getDashboardStats = async () => {
  try {
    const totalReservations = await Reservations.countDocuments();

    const totalAccommodations = await Accommodations.countDocuments();

    const totalStaff = await Users.countDocuments({
      'position.value': { $ne: 'CUSTOMER' }
    });

    const totalCustomers = await Users.countDocuments({
      'position.value': 'CUSTOMER'
    });

    return {
      success: true,
      data: {
        totalReservations,
        totalAccommodations,
        totalStaff,
        totalCustomers
      }
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard statistics: ${error.message}`);
  }
};

export const getUserDashboardStats = async (userId) => {
  try {
    const userReservations = await Reservations.countDocuments({
      userId: userId
    });

    const userReservationsByStatus = await Reservations.aggregate([
      {
        $match: {
          userId: userId
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 30);
    
    const userRecentReservations = await Reservations.countDocuments({
      userId: userId,
      createdAt: { $gte: dateThreshold }
    });

    return {
      success: true,
      data: {
        totalUserReservations: userReservations,
        userRecentReservations,
        userReservationsByStatus: userReservationsByStatus.reduce((acc, item) => {
          acc[item._id || 'unknown'] = item.count;
          return acc;
        }, {})
      }
    };
  } catch (error) {
    throw new Error(`Error fetching user dashboard statistics: ${error.message}`);
  }
};

export const getDetailedDashboardStats = async () => {
  try {
    const basicStats = await getDashboardStats();

    const reservationsByStatus = await Reservations.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const staticStaffByPosition = {
      'MASTER_ADMIN': 1,
      'ADMIN': 3,
      'RECEPTIONIST': 8
    };

    const staticOccupancyRate = {
      currentOccupancy: 75,
      totalCapacity: 100,
      occupancyPercentage: 75,
      availableRooms: 25,
      occupiedRooms: 75
    };

    const staticRevenue = {
      totalRevenue: 1250000,
      monthlyRevenue: 185000,
      dailyRevenue: 6200,
      averageRevenuePerReservation: 2500,
      currency: 'PHP'
    };

    const usersByStatus = await Users.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const customersByStatus = await Users.aggregate([
      {
        $match: {
          'position.value': 'CUSTOMER'
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const staffByStatus = await Users.aggregate([
      {
        $match: {
          'position.value': { $ne: 'CUSTOMER' }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      success: true,
      data: {
        ...basicStats.data,
        breakdowns: {
          reservationsByStatus: reservationsByStatus.reduce((acc, item) => {
            acc[item._id || 'unknown'] = item.count;
            return acc;
          }, {}),
          staffByPosition: staticStaffByPosition,
          occupancyRate: staticOccupancyRate,
          revenue: staticRevenue,
          usersByStatus: usersByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          customersByStatus: customersByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          staffByStatus: staffByStatus.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        }
      }
    };
  } catch (error) {
    throw new Error(`Error fetching detailed dashboard statistics: ${error.message}`);
  }
};

export const getRecentActivityStats = async (days = 7) => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    const recentReservations = await Reservations.countDocuments({
      createdAt: { $gte: dateThreshold }
    });

    const recentUsers = await Users.countDocuments({
      createdAt: { $gte: dateThreshold }
    });

    const recentCustomers = await Users.countDocuments({
      'position.value': 'CUSTOMER',
      createdAt: { $gte: dateThreshold }
    });

    return {
      success: true,
      data: {
        period: `Last ${days} days`,
        recentReservations,
        recentUsers,
        recentCustomers
      }
    };
  } catch (error) {
    throw new Error(`Error fetching recent activity statistics: ${error.message}`);
  }
};

export const getMonthlyStats = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    const monthlyReservations = await Reservations.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const monthlyUsers = await Users.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const formattedReservations = monthNames.map((month, index) => {
      const monthData = monthlyReservations.find(item => item._id === index + 1);
      return {
        month,
        count: monthData ? monthData.count : 0
      };
    });

    const formattedUsers = monthNames.map((month, index) => {
      const monthData = monthlyUsers.find(item => item._id === index + 1);
      return {
        month,
        count: monthData ? monthData.count : 0
      };
    });

    return {
      success: true,
      data: {
        year: currentYear,
        monthlyReservations: formattedReservations,
        monthlyUsers: formattedUsers
      }
    };
  } catch (error) {
    throw new Error(`Error fetching monthly statistics: ${error.message}`);
  }
};
