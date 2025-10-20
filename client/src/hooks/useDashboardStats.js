import { useMemo } from 'react';
import { useGetDashboardStats } from 'api/dashboard';

const defaultFinancial = {
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

const defaultDashboard = {
  role: null,
  totalReservations: 0,
  reservationsByStatus: {},
  reservationsByType: {
    walkIn: 0,
    online: 0
  },
  reservationsByPeriod: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0
  },
  occupancyRate: {
    currentOccupancy: 0,
    totalCapacity: 0,
    occupancyPercentage: 0,
    availableRooms: 0,
    occupiedRooms: 0
  },
  occupancyByAccommodationType: [],
  recentReservations: 0,
  recentWalkInReservations: 0,
  staffMembers: {
    total: 0,
    active: 0,
    inactive: 0,
    byPosition: {}
  },
  totalCustomers: {
    total: 0,
    newThisMonth: 0
  },
  financialStatistics: defaultFinancial,
  totalUserReservations: 0,
  userRecentReservations: 0,
  userReservationsByStatus: {}
};

const mergeDashboard = (payload) => {
  if (!payload) {
    return { ...defaultDashboard };
  }

  return {
    ...defaultDashboard,
    ...payload,
    reservationsByType: {
      ...defaultDashboard.reservationsByType,
      ...(payload.reservationsByType || {})
    },
    reservationsByPeriod: {
      ...defaultDashboard.reservationsByPeriod,
      ...(payload.reservationsByPeriod || {})
    },
    occupancyRate: {
      ...defaultDashboard.occupancyRate,
      ...(payload.occupancyRate || {})
    },
    staffMembers: {
      ...defaultDashboard.staffMembers,
      ...(payload.staffMembers || {}),
      byPosition: {
        ...defaultDashboard.staffMembers.byPosition,
        ...(payload.staffMembers?.byPosition || {})
      }
    },
    totalCustomers: {
      ...defaultDashboard.totalCustomers,
      ...(payload.totalCustomers || {})
    },
    financialStatistics: {
      ...defaultFinancial,
      ...(payload.financialStatistics || {}),
      monthlyRevenue: {
        ...defaultFinancial.monthlyRevenue,
        ...(payload.financialStatistics?.monthlyRevenue || {})
      },
      reservationStats: {
        ...defaultFinancial.reservationStats,
        ...(payload.financialStatistics?.reservationStats || {})
      },
      summary: {
        ...defaultFinancial.summary,
        ...(payload.financialStatistics?.summary || {})
      }
    },
    occupancyByAccommodationType: Array.isArray(payload.occupancyByAccommodationType)
      ? payload.occupancyByAccommodationType
      : defaultDashboard.occupancyByAccommodationType,
    userReservationsByStatus: payload.userReservationsByStatus || defaultDashboard.userReservationsByStatus
  };
};

const createTrend = (valueLabel = '0%', isPositive = true) => ({
  value: valueLabel,
  positive: isPositive
});

const computeTrendPercent = (current, baseline) => {
  if (current === undefined || current === null) {
    return createTrend();
  }

  if (!baseline) {
    if (current === 0) {
      return createTrend();
    }

    const sign = current >= 0 ? '+' : '';
    return createTrend(`${sign}${current}`, current >= 0);
  }

  const diff = current - baseline;
  const percent = baseline === 0 ? 100 : Math.round((diff / baseline) * 100);
  const safePercent = Number.isFinite(percent) ? percent : 0;
  const sign = safePercent >= 0 ? '+' : '';

  return createTrend(`${sign}${safePercent}%`, safePercent >= 0);
};

const buildDerivedMetrics = (dashboard) => {
  const defaults = {
    reservations: {
      total: 0,
      today: 0,
      week: 0,
      month: 0,
      year: 0,
      trend: createTrend()
    },
    staff: {
      total: 0,
      active: 0,
      trend: createTrend('0')
    },
    customers: {
      total: 0,
      new: 0,
      trend: createTrend()
    },
    rooms: {
      total: 0,
      occupied: 0,
      available: 0,
      occupancyRate: 0,
      trend: createTrend()
    },
    recentActivity: [
      {
        type: 'Dashboard',
        user: 'System',
        detail: 'No recent activity data available yet.',
        time: 'Just now'
      }
    ],
    financial: {
      ...defaultFinancial
    },
    occupancyByAccommodationType: dashboard.occupancyByAccommodationType
  };

  if (!dashboard || !dashboard.role) {
    return defaults;
  }

  const reservationsByPeriod = dashboard.reservationsByPeriod || {};
  const occupancy = dashboard.occupancyRate || {};
  const financial = dashboard.financialStatistics || defaultFinancial;
  const staffMembers = dashboard.staffMembers || {};
  const customers = dashboard.totalCustomers || {};

  const derived = { ...defaults };
  derived.occupancyByAccommodationType = dashboard.occupancyByAccommodationType;

  if (dashboard.role === 'CUSTOMER') {
    const totalReservations = dashboard.totalUserReservations ?? 0;
    const recentReservations = dashboard.userRecentReservations ?? 0;

    derived.reservations = {
      total: totalReservations,
      today: recentReservations,
      week: recentReservations,
      month: recentReservations,
      year: totalReservations,
      trend: createTrend(`+${recentReservations || 0}`)
    };

    derived.customers = {
      total: 1,
      new: 0,
      trend: createTrend('0')
    };

    const activities = [];
    const statusEntries = Object.entries(dashboard.userReservationsByStatus || {});

    statusEntries.forEach(([status, count]) => {
      activities.push({
        type: 'Reservation',
        user: 'You',
        detail: `${count} ${status.toLowerCase()} reservation${count === 1 ? '' : 's'}`,
        time: 'All time'
      });
    });

    if (typeof recentReservations === 'number') {
      activities.push({
        type: 'Reservations',
        user: 'You',
        detail: `${recentReservations} reservations created recently`,
        time: 'Last 30 days'
      });
    }

    derived.recentActivity = activities.length ? activities : defaults.recentActivity;
  } else {
    const totalReservations = dashboard.totalReservations ?? 0;
    const monthlyReservations = reservationsByPeriod.thisMonth ?? 0;
    const weeklyReservations = reservationsByPeriod.thisWeek ?? 0;
    const yearlyReservations = reservationsByPeriod.thisYear ?? totalReservations;
    const todayReservations = reservationsByPeriod.today ?? 0;

    const inferredBaseline = weeklyReservations
      ? weeklyReservations * 4
      : yearlyReservations
        ? yearlyReservations / 12
        : null;

    derived.reservations = {
      total: totalReservations,
      today: todayReservations,
      week: weeklyReservations,
      month: monthlyReservations,
      year: yearlyReservations,
      trend: computeTrendPercent(monthlyReservations, inferredBaseline)
    };

    derived.rooms = {
      total: occupancy.totalCapacity ?? 0,
      occupied: occupancy.occupiedRooms ?? 0,
      available: occupancy.availableRooms ?? Math.max(0, (occupancy.totalCapacity ?? 0) - (occupancy.occupiedRooms ?? 0)),
      occupancyRate: occupancy.occupancyPercentage ?? 0,
      trend: createTrend(`${occupancy.occupancyPercentage ?? 0}%`, (occupancy.occupancyPercentage ?? 0) >= 70)
    };

    if (dashboard.role === 'RECEPTIONIST') {
      const activities = [];

      if (typeof dashboard.recentReservations === 'number') {
        activities.push({
          type: 'Reservations',
          user: 'System',
          detail: `${dashboard.recentReservations} reservations handled recently`,
          time: 'Last 7 days'
        });
      }

      if (typeof dashboard.recentWalkInReservations === 'number') {
        activities.push({
          type: 'Walk-in',
          user: 'System',
          detail: `${dashboard.recentWalkInReservations} walk-in guests processed`,
          time: 'Last 7 days'
        });
      }

      derived.recentActivity = activities.length ? activities : defaults.recentActivity;
    } else {
      const percentActive = staffMembers.total
        ? Math.round(((staffMembers.active ?? 0) / staffMembers.total) * 100)
        : 0;

      derived.staff = {
        total: staffMembers.total ?? 0,
        active: staffMembers.active ?? 0,
        trend: createTrend(`${percentActive}%`, percentActive >= 70)
      };

      const percentGrowth = customers.total
        ? Math.round(((customers.newThisMonth ?? 0) / customers.total) * 100)
        : 0;

      derived.customers = {
        total: customers.total ?? 0,
        new: customers.newThisMonth ?? 0,
        trend: createTrend(`${percentGrowth >= 0 ? '+' : ''}${percentGrowth}%`, percentGrowth >= 0)
      };

      const activities = [];

      if (typeof dashboard.recentReservations === 'number') {
        activities.push({
          type: 'Reservations',
          user: 'System',
          detail: `${dashboard.recentReservations} reservations created in the last 7 days`,
          time: 'Last 7 days'
        });
      }

      if (typeof dashboard.recentWalkInReservations === 'number') {
        activities.push({
          type: 'Walk-in',
          user: 'System',
          detail: `${dashboard.recentWalkInReservations} walk-in reservations logged recently`,
          time: 'Last 7 days'
        });
      }

      if (typeof staffMembers.active === 'number') {
        activities.push({
          type: 'Staff',
          user: 'System',
          detail: `${staffMembers.active} active staff members`,
          time: 'Current'
        });
      }

      if (typeof customers.newThisMonth === 'number') {
        activities.push({
          type: 'Customers',
          user: 'System',
          detail: `${customers.newThisMonth} new customers this month`,
          time: 'This month'
        });
      }

      derived.recentActivity = activities.length ? activities : defaults.recentActivity;
    }
  }

  derived.financial = financial;
  derived.staff = derived.staff.total !== undefined ? derived.staff : defaults.staff;
  derived.customers = derived.customers.total !== undefined ? derived.customers : defaults.customers;
  derived.rooms = derived.rooms.total !== undefined ? derived.rooms : defaults.rooms;

  return derived;
};

const useDashboardStats = (query = {}) => {
  const { data, isLoading, error, mutate } = useGetDashboardStats(query);

  const memoized = useMemo(() => {
    const success = Boolean(data?.success && data?.data);
    const dashboard = mergeDashboard(success ? data.data : null);
    const derived = buildDerivedMetrics(dashboard);

    return {
      dashboard,
      derived,
      success
    };
  }, [data]);

  return {
    dashboard: memoized.dashboard,
    stats: memoized.derived,
    success: memoized.success,
    isLoading,
    error,
    mutate,
    raw: data
  };
};

export default useDashboardStats;
