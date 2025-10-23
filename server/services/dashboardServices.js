import Reservations from '../models/reservationsModels.js';
import Accommodations from '../models/accommodationsModels.js';
import Users from '../models/usersModels.js';

async function getDashboardStats() {
  try {
    const staffFilter = {
      position: {
        $elemMatch: {
          value: { $ne: 'CUSTOMER' }
        }
      }
    };

    const customerFilter = {
      position: {
        $elemMatch: {
          value: 'CUSTOMER'
        }
      }
    };

    const [totalReservations, totalAccommodations, totalStaff, totalCustomers] = await Promise.all([
      Reservations.countDocuments(),
      Accommodations.countDocuments(),
      Users.countDocuments(staffFilter),
      Users.countDocuments(customerFilter)
    ]);

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
    const [
      basicStats,
      reservationCounts,
      occupancyRate,
      staffAndCustomerStats,
      financialStats,
      usersByStatusAggregate,
      customersByStatusAggregate,
      staffByStatusAggregate
    ] = await Promise.all([
      getDashboardStats(),
      getReservationCounts(),
      getCurrentOccupancyRate(),
      getStaffAndCustomerStats(),
      getFinancialAnalytics(),
      Users.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Users.aggregate([
        {
          $match: {
            position: {
              $elemMatch: {
                value: 'CUSTOMER'
              }
            }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Users.aggregate([
        {
          $match: {
            position: {
              $elemMatch: {
                value: { $ne: 'CUSTOMER' }
              }
            }
          }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const toCountMap = (items) => items.reduce((acc, item) => {
      if (!item) {
        return acc;
      }
      const key = item._id || 'UNKNOWN';
      acc[key] = item.count;
      return acc;
    }, {});

    const staffByPosition = Object.entries(staffAndCustomerStats.staffMembers.byPosition || {})
      .reduce((acc, [position, metrics]) => {
        acc[position] = metrics.total || 0;
        return acc;
      }, {});

    const revenueSnapshot = financialStats?.data ? {
      totalRevenue: financialStats.data.monthlyRevenue?.totalRevenue ?? 0,
      monthlyRevenue: financialStats.data.monthlyRevenue?.earnings ?? 0,
      dailyRevenue: financialStats.data.summary?.averageDailyRevenue ?? 0,
      averageRevenuePerReservation: financialStats.data.summary?.averageRevenuePerReservation ?? 0,
      currency: financialStats.data.summary?.currency || 'PHP'
    } : {
      totalRevenue: 0,
      monthlyRevenue: 0,
      dailyRevenue: 0,
      averageRevenuePerReservation: 0,
      currency: 'PHP'
    };

    return {
      success: true,
      data: {
        ...basicStats.data,
        breakdowns: {
          reservationsByStatus: reservationCounts.reservationsByStatus,
          staffByPosition,
          occupancyRate: {
            overall: occupancyRate.overall,
            byAccommodationType: occupancyRate.byAccommodationType
          },
          revenue: revenueSnapshot,
          usersByStatus: toCountMap(usersByStatusAggregate),
          customersByStatus: toCountMap(customersByStatusAggregate),
          staffByStatus: toCountMap(staffByStatusAggregate)
        }
      }
    };
  } catch (error) {
    throw new Error(`Error fetching detailed dashboard statistics: ${error.message}`);
  }
};

async function getRecentActivityStats(days = 7) {
  try {
    const periodStart = new Date();
    periodStart.setHours(0, 0, 0, 0);
    periodStart.setDate(periodStart.getDate() - (Math.max(days, 1) - 1));

    const [recentReservations, recentUsers, recentCustomers] = await Promise.all([
      Reservations.countDocuments({
        createdAt: { $gte: periodStart }
      }),
      Users.countDocuments({
        createdAt: { $gte: periodStart }
      }),
      Users.countDocuments({
        createdAt: { $gte: periodStart },
        position: {
          $elemMatch: {
            value: 'CUSTOMER'
          }
        }
      })
    ]);

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

async function getMonthlyStats() {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [monthlyReservationsAggregate, monthlyUsersAggregate] = await Promise.all([
      Reservations.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lt: endOfYear }
          }
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            count: { $sum: 1 }
          }
        }
      ]),
      Users.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lt: endOfYear }
          }
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const reservationCountByMonth = monthlyReservationsAggregate.reduce((acc, item) => {
      if (item?._id?.month) {
        acc[item._id.month] = item.count;
      }
      return acc;
    }, {});

    const usersCountByMonth = monthlyUsersAggregate.reduce((acc, item) => {
      if (item?._id?.month) {
        acc[item._id.month] = item.count;
      }
      return acc;
    }, {});

    const formattedReservations = monthNames.map((month, index) => ({
      month,
      count: reservationCountByMonth[index + 1] || 0
    }));

    const formattedUsers = monthNames.map((month, index) => ({
      month,
      count: usersCountByMonth[index + 1] || 0
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
    startDate: { $lt: endOfToday },
    endDate: { $gt: today }
  });

  const availableRooms = Math.max(0, totalAccommodations - currentlyOccupied);
  const occupancyPercentage = totalAccommodations > 0 ? Math.round((currentlyOccupied / totalAccommodations) * 100 * 100) / 100 : 0;

  const occupancyByType = await Reservations.aggregate([
    {
      $match: {
        status: 'CONFIRMED',
        startDate: { $lt: endOfToday },
        endDate: { $gt: today }
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
    const occupancyPercentage = total > 0 ? Math.round((occupied / total) * 100 * 100) / 100 : 0;

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
    const allStaff = await Users.find({
      'position.value': { $ne: 'CUSTOMER' }
    }, { position: 1, status: 1 });

    const totalStaff = allStaff.length;
    const activeStaff = allStaff.filter(user => user.status === 'ACTIVE').length;

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

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    const daysInMonth = endOfMonth.getDate();

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
        month: targetMonth + 1,
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
    const defaultFinancialStatistics = {
      month: null,
      year: null,
      monthName: '',
      monthlyRevenue: {
        earnings: 0,
        pendingPayments: 0,
        totalRevenue: 0
      },
      reservationStats: {
        totalReservations: 0,
        fullyPaidReservations: 0,
        partiallyPaidReservations: 0,
        unpaidReservations: 0
      },
      summary: {
        totalEarningsThisMonth: 0,
        averageDailyRevenue: 0,
        averageRevenuePerReservation: 0,
        pendingPayments: 0,
        currency: 'PHP'
      }
    };
    const financialStatistics = financialStats?.data || defaultFinancialStatistics;

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
        financialStatistics
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
  getDashboardStats,
  getCustomerDashboardStats,
  getReceptionistDashboardStats,
  getAdminDashboardStats,
  getRoleBasedDashboardStats,
  getStaffAndCustomerStats,
  getFinancialAnalytics,
  getDetailedDashboardStats,
  getRecentActivityStats,
  getMonthlyStats
};