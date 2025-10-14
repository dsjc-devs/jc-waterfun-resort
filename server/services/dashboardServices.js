import Reservations from '../models/reservationsModels.js';
import Accommodations from '../models/accommodationsModels.js';
import Users from '../models/usersModels.js';

async function getDashboardStats() {
  try {
    const totalReservations = 245;
    const totalAccommodations = 50;
    const totalStaff = 12;
    const totalCustomers = 180;

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

async function getCustomerDashboardStats(userId) {
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
    throw new Error(`Error fetching customer dashboard statistics: ${error.message}`);
  }
};

async function getDetailedDashboardStats() {
  try {
    const basicStats = await getDashboardStats();

    const staticReservationsByStatus = {
      'confirmed': 98,
      'pending': 45,
      'completed': 87,
      'cancelled': 15
    };

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

    const staticUsersByStatus = {
      'active': 165,
      'inactive': 27
    };

    const staticCustomersByStatus = {
      'active': 152,
      'inactive': 28
    };

    const staticStaffByStatus = {
      'active': 11,
      'inactive': 1
    };

    return {
      success: true,
      data: {
        ...basicStats.data,
        breakdowns: {
          reservationsByStatus: staticReservationsByStatus,
          staffByPosition: staticStaffByPosition,
          occupancyRate: staticOccupancyRate,
          revenue: staticRevenue,
          usersByStatus: staticUsersByStatus,
          customersByStatus: staticCustomersByStatus,
          staffByStatus: staticStaffByStatus
        }
      }
    };
  } catch (error) {
    throw new Error(`Error fetching detailed dashboard statistics: ${error.message}`);
  }
};

async function getRecentActivityStats(days = 7) {
  try {
    const staticRecentReservations = Math.max(1, Math.floor(days * 2.5));
    const staticRecentUsers = Math.max(1, Math.floor(days * 1.2));
    const staticRecentCustomers = Math.max(1, Math.floor(days * 1.0)); 

    return {
      success: true,
      data: {
        period: `Last ${days} days`,
        recentReservations: staticRecentReservations,
        recentUsers: staticRecentUsers,
        recentCustomers: staticRecentCustomers
      }
    };
  } catch (error) {
    throw new Error(`Error fetching recent activity statistics: ${error.message}`);
  }
};

async function getMonthlyStats() {
  try {
    const currentYear = new Date().getFullYear();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const staticMonthlyReservationsData = [18, 22, 28, 35, 42, 38, 45, 48, 40, 32, 25, 20];
    const staticMonthlyUsersData = [12, 15, 18, 22, 28, 25, 30, 32, 28, 20, 16, 14];

    const formattedReservations = monthNames.map((month, index) => ({
      month,
      count: staticMonthlyReservationsData[index]
    }));

    const formattedUsers = monthNames.map((month, index) => ({
      month,
      count: staticMonthlyUsersData[index]
    }));

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

async function getReservationCounts() {
  const totalReservations = await Reservations.countDocuments();
  
  const reservationsByStatus = await Reservations.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - 7);
  
  const recentReservations = await Reservations.countDocuments({
    createdAt: { $gte: dateThreshold }
  });

  return {
    totalReservations,
    reservationsByStatus: reservationsByStatus.reduce((acc, item) => {
      acc[item._id || 'unknown'] = item.count;
      return acc;
    }, {}),
    recentReservations
  };
}

async function getWalkInReservationCounts() {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - 7);

  const totalWalkInReservations = await Reservations.countDocuments({
    isWalkIn: true
  });

  const recentWalkInReservations = await Reservations.countDocuments({
    isWalkIn: true,
    createdAt: { $gte: dateThreshold }
  });

  const onlineReservations = await Reservations.countDocuments({
    isWalkIn: { $ne: true }
  });

  return {
    walkIn: totalWalkInReservations,
    online: onlineReservations,
    recentWalkInReservations
  };
}

async function getTimePeriodReservationCounts() {
  const now = new Date();
  
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  const todayReservations = await Reservations.countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay }
  });

  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(now.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  const thisWeekReservations = await Reservations.countDocuments({
    createdAt: { $gte: startOfWeek, $lt: endOfWeek }
  });

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  const thisMonthReservations = await Reservations.countDocuments({
    createdAt: { $gte: startOfMonth, $lt: endOfMonth }
  });

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  
  const thisYearReservations = await Reservations.countDocuments({
    createdAt: { $gte: startOfYear, $lt: endOfYear }
  });

  return {
    today: todayReservations,
    thisWeek: thisWeekReservations,
    thisMonth: thisMonthReservations,
    thisYear: thisYearReservations
  };
}

async function getCurrentOccupancyRate() {
  const totalAccommodations = await Accommodations.countDocuments();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setDate(today.getDate() + 1);
  
  const currentlyOccupied = await Reservations.countDocuments({
    status: 'CONFIRMED',
    startDate: { $lte: today },
    endDate: { $gte: endOfToday }
  });

  const availableRooms = Math.max(0, totalAccommodations - currentlyOccupied);
  const occupancyPercentage = totalAccommodations > 0 ? Math.round((currentlyOccupied / totalAccommodations) * 100) : 0;

  const occupancyByType = await Reservations.aggregate([
    {
      $match: {
        status: 'CONFIRMED',
        startDate: { $lte: today },
        endDate: { $gte: endOfToday }
      }
    },
    {
      $lookup: {
        from: 'accommodations',
        localField: 'accommodationId',
        foreignField: '_id',
        as: 'accommodation'
      }
    },
    {
      $unwind: '$accommodation'
    },
    {
      $group: {
        _id: '$accommodation.type',
        occupiedCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        accommodationType: '$_id',
        occupiedCount: 1
      }
    }
  ]);

  const accommodationsByType = await Accommodations.aggregate([
    {
      $group: {
        _id: '$type',
        totalCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        accommodationType: '$_id',
        totalCount: 1
      }
    }
  ]);
  
  const occupancyByAccommodationType = accommodationsByType.map(typeInfo => {
    const occupiedInfo = occupancyByType.find(
      item => item.accommodationType === typeInfo.accommodationType
    );
    
    const occupied = occupiedInfo ? occupiedInfo.occupiedCount : 0;
    const total = typeInfo.totalCount;
    const available = total - occupied;
    const occupancyPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    return {
      accommodationType: typeInfo.accommodationType,
      totalCount: total,
      occupiedCount: occupied,
      availableCount: available,
      occupancyPercentage: occupancyPercentage
    };
  });

  return {
    overall: {
      currentOccupancy: currentlyOccupied,
      totalCapacity: totalAccommodations,
      occupancyPercentage: occupancyPercentage,
      availableRooms: availableRooms,
      occupiedRooms: currentlyOccupied
    },
    byAccommodationType: occupancyByAccommodationType
  };
}

async function getStaffAndCustomerStats() {
  try {
    // Simple approach - get all non-customer users first
    const allStaff = await Users.find({
      'position.value': { $ne: 'CUSTOMER' }
    }, { position: 1, status: 1 });

    const totalStaff = allStaff.length;
    const activeStaff = allStaff.filter(user => user.status === 'ACTIVE').length;

    // Process staff by position
    const positionBreakdown = {};
    
    allStaff.forEach(user => {
      if (user.position && user.position.length > 0) {
        const primaryPosition = user.position[0].value;
        if (primaryPosition && primaryPosition !== 'CUSTOMER') {
          if (!positionBreakdown[primaryPosition]) {
            positionBreakdown[primaryPosition] = {
              total: 0,
              active: 0,
              inactive: 0
            };
          }
          positionBreakdown[primaryPosition].total++;
          if (user.status === 'ACTIVE') {
            positionBreakdown[primaryPosition].active++;
          } else {
            positionBreakdown[primaryPosition].inactive++;
          }
        }
      }
    });

    const totalCustomers = await Users.countDocuments({
      'position.value': 'CUSTOMER'
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newCustomersThisMonth = await Users.countDocuments({
      'position.value': 'CUSTOMER',
      createdAt: { $gte: startOfMonth }
    });

    return {
      staffMembers: {
        total: totalStaff,
        active: activeStaff,
        inactive: totalStaff - activeStaff,
        byPosition: positionBreakdown
      },
      totalCustomers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth
      }
    };
  } catch (error) {
    throw new Error(`Error fetching staff and customer statistics: ${error.message}`);
  }
}

async function getFinancialAnalytics(month = null, year = null) {
  try {
    const currentDate = new Date();
    const targetMonth = month ? month - 1 : currentDate.getMonth(); // month - 1 because JS months are 0-indexed
    const targetYear = year || currentDate.getFullYear();

    // Get start and end of the specified month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    const daysInMonth = endOfMonth.getDate();

    // Get aggregated payments for the entire month
    const monthlyPayments = await Reservations.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $in: ['CONFIRMED', 'COMPLETED'] }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$amount.totalPaid' },
          totalPendingPayments: { 
            $sum: { 
              $subtract: ['$amount.total', '$amount.totalPaid'] 
            } 
          },
          totalRevenue: { $sum: '$amount.total' },
          totalReservations: { $sum: 1 },
          fullyPaidReservations: {
            $sum: {
              $cond: [
                { $eq: ['$amount.totalPaid', '$amount.total'] },
                1,
                0
              ]
            }
          },
          partiallyPaidReservations: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $gt: ['$amount.totalPaid', 0] },
                    { $lt: ['$amount.totalPaid', '$amount.total'] }
                  ]
                },
                1,
                0
              ]
            }
          },
          unpaidReservations: {
            $sum: {
              $cond: [
                { $eq: ['$amount.totalPaid', 0] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Extract data from aggregation result
    const monthData = monthlyPayments[0] || {
      totalEarnings: 0,
      totalPendingPayments: 0,
      totalRevenue: 0,
      totalReservations: 0,
      fullyPaidReservations: 0,
      partiallyPaidReservations: 0,
      unpaidReservations: 0
    };

    const totalEarningsThisMonth = monthData.totalEarnings;
    const totalPendingPayments = monthData.totalPendingPayments;
    const averageDailyRevenue = totalEarningsThisMonth / daysInMonth;
    const averageRevenuePerReservation = monthData.totalReservations > 0 ? monthData.totalRevenue / monthData.totalReservations : 0;

    return {
      success: true,
      data: {
        month: targetMonth + 1, // Convert back to 1-indexed
        year: targetYear,
        monthName: new Date(targetYear, targetMonth, 1).toLocaleString('default', { month: 'long' }),
        monthlyRevenue: {
          earnings: Math.round(totalEarningsThisMonth),
          pendingPayments: Math.round(totalPendingPayments),
          totalRevenue: Math.round(monthData.totalRevenue)
        },
        reservationStats: {
          totalReservations: monthData.totalReservations,
          fullyPaidReservations: monthData.fullyPaidReservations,
          partiallyPaidReservations: monthData.partiallyPaidReservations,
          unpaidReservations: monthData.unpaidReservations
        },
        summary: {
          totalEarningsThisMonth: Math.round(totalEarningsThisMonth),
          averageDailyRevenue: Math.round(averageDailyRevenue),
          averageRevenuePerReservation: Math.round(averageRevenuePerReservation),
          pendingPayments: Math.round(totalPendingPayments),
          currency: 'PHP'
        }
      }
    };
  } catch (error) {
    throw new Error(`Error fetching financial analytics: ${error.message}`);
  }
}

async function getReceptionistDashboardStats() {
  try {
    const reservationCounts = await getReservationCounts();
    const walkInCounts = await getWalkInReservationCounts();
    const timePeriodCounts = await getTimePeriodReservationCounts();
    const occupancyRate = await getCurrentOccupancyRate();

    return {
      success: true,
      data: {
        totalReservations: reservationCounts.totalReservations,
        reservationsByStatus: reservationCounts.reservationsByStatus,
        reservationsByType: {
          walkIn: walkInCounts.walkIn,
          online: walkInCounts.online
        },
        reservationsByPeriod: timePeriodCounts,
        occupancyRate: occupancyRate.overall,
        occupancyByAccommodationType: occupancyRate.byAccommodationType,
        recentReservations: reservationCounts.recentReservations,
        recentWalkInReservations: walkInCounts.recentWalkInReservations
      }
    };
  } catch (error) {
    throw new Error(`Error fetching receptionist dashboard statistics: ${error.message}`);
  }
};

async function getAdminDashboardStats(financialMonth = null, financialYear = null) {
  try {
    const reservationCounts = await getReservationCounts();
    const walkInCounts = await getWalkInReservationCounts();
    const timePeriodCounts = await getTimePeriodReservationCounts();
    const occupancyRate = await getCurrentOccupancyRate();
    const staffAndCustomerStats = await getStaffAndCustomerStats();
    const financialStats = await getFinancialAnalytics(financialMonth, financialYear);

    return {
      success: true,
      data: {
        totalReservations: reservationCounts.totalReservations,
        reservationsByStatus: reservationCounts.reservationsByStatus,
        reservationsByType: {
          walkIn: walkInCounts.walkIn,
          online: walkInCounts.online
        },
        reservationsByPeriod: timePeriodCounts,
        occupancyRate: occupancyRate.overall,
        occupancyByAccommodationType: occupancyRate.byAccommodationType,
        recentReservations: reservationCounts.recentReservations,
        recentWalkInReservations: walkInCounts.recentWalkInReservations,
        staffMembers: staffAndCustomerStats.staffMembers,
        totalCustomers: staffAndCustomerStats.totalCustomers,
        financialStatistics: financialStats.data
      }
    };
  } catch (error) {
    throw new Error(`Error fetching admin dashboard statistics: ${error.message}`);
  }
};

async function getRoleBasedDashboardStats(role, userId = null, financialMonth = null, financialYear = null) {
  try {
    switch (role) {
      case 'MASTER_ADMIN':
      case 'ADMIN':
        const adminStats = await getAdminDashboardStats(financialMonth, financialYear);
        return {
          success: true,
          data: {
            role: role,
            ...adminStats.data
          }
        };

      case 'RECEPTIONIST':
        const receptionistStats = await getReceptionistDashboardStats();
        return {
          success: true,
          data: {
            role: role,
            ...receptionistStats.data
          }
        };

      case 'CUSTOMER':
        const userStats = await getCustomerDashboardStats(userId);
        return {
          success: true,
          data: {
            role: role,
            ...userStats.data
          }
        };

      default:
        throw new Error('Invalid role specified');
    }
  } catch (error) {
    throw new Error(`Error fetching role-based dashboard statistics: ${error.message}`);
  }
}

export default {
  getCustomerDashboardStats,
  getReceptionistDashboardStats,
  getAdminDashboardStats,
  getRoleBasedDashboardStats,
  getStaffAndCustomerStats,
  getFinancialAnalytics
};

export { };
