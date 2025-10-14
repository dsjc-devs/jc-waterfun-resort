import React, { useState } from 'react'
import { APP_DEFAULT_PATH } from 'config/config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import DashboardCard from 'components/DashboardCard';
import { Grid, Box, Typography, Container, Paper, Divider, Avatar, Stack, Tooltip, LinearProgress, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import {
  CalendarTodayOutlined,
  CalendarViewWeek,
  CalendarMonth,
  Event,
  TrendingUp,
  TrendingDown,
  BarChart
} from '@mui/icons-material';
import useAuth from 'hooks/useAuth';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, Legend, CartesianGrid } from 'recharts';
import useGetPosition from 'hooks/useGetPosition';
import { Link as RouterLink } from 'react-router-dom';

// Enhanced hook for stats with trend data
const useDashboardStats = () => {
  // Replace with real API call
  return {
    isLoading: false,
    stats: {
      reservations: {
        total: 1247,
        today: 5,
        week: 32,
        month: 156,
        year: 1247,
        trend: { value: '+12.5%', positive: true }
      },
      staff: {
        total: 24,
        active: 22,
        trend: { value: '+2', positive: true }
      },
      customers: {
        total: 2856,
        new: 45,
        trend: { value: '+8.3%', positive: true }
      },
      rooms: {
        total: 45,
        occupied: 38,
        available: 7,
        occupancyRate: 84.4,
        trend: { value: '-2.1%', positive: false }
      },
      recentActivity: [
        { type: 'Reservation', user: 'John Doe', detail: 'Booked Room 203', time: '2 mins ago' },
        { type: 'Customer', user: 'Jane Smith', detail: 'Registered as new customer', time: '10 mins ago' },
        { type: 'Staff', user: 'Mark Lee', detail: 'Checked in for shift', time: '30 mins ago' },
        { type: 'Room', user: 'System', detail: 'Room 101 marked as available', time: '1 hour ago' }
      ]
    }
  }
};

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Dashboard' }
];

const Dashboard = () => {
  const { isLoading, stats } = useDashboardStats();
  const { user } = useAuth();
  const { isAdmin, isCustomer, isMasterAdmin, isReceptionist } = useGetPosition()
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const reservationDetails = [
    {
      icon: <CalendarTodayOutlined fontSize="small" color="inherit" />,
      label: 'Today',
      value: stats.reservations.today
    },
    {
      icon: <CalendarViewWeek fontSize="small" color="inherit" />,
      label: 'This Week',
      value: stats.reservations.week
    },
    {
      icon: <CalendarMonth fontSize="small" color="inherit" />,
      label: 'This Month',
      value: stats.reservations.month
    },
    {
      icon: <Event fontSize="small" color="inherit" />,
      label: 'This Year',
      value: stats.reservations.year
    }
  ];

  const roomDetails = [
    {
      icon: <HomeOutlined style={{ fontSize: 12 }} />,
      label: 'Occupied',
      value: stats.rooms.occupied
    },
    {
      icon: <HomeOutlined style={{ fontSize: 12 }} />,
      label: 'Available',
      value: stats.rooms.available
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 12 }} />,
      label: 'Occupancy Rate',
      value: `${stats.rooms.occupancyRate}%`
    }
  ];

  // Trends Overview mini cards
  const trends = [
    {
      label: 'Reservations',
      value: stats.reservations.trend.value,
      positive: stats.reservations.trend.positive,
      icon: stats.reservations.trend.positive ? <TrendingUp color="success" /> : <TrendingDown color="error" />,
      color: stats.reservations.trend.positive ? 'success.main' : 'error.main'
    },
    {
      label: 'Rooms',
      value: stats.rooms.trend.value,
      positive: stats.rooms.trend.positive,
      icon: stats.rooms.trend.positive ? <TrendingUp color="success" /> : <TrendingDown color="error" />,
      color: stats.rooms.trend.positive ? 'success.main' : 'error.main'
    },
    {
      label: 'Customers',
      value: stats.customers.trend.value,
      positive: stats.customers.trend.positive,
      icon: stats.customers.trend.positive ? <TrendingUp color="success" /> : <TrendingDown color="error" />,
      color: stats.customers.trend.positive ? 'success.main' : 'error.main'
    },
    {
      label: 'Staff',
      value: stats.staff.trend.value,
      positive: stats.staff.trend.positive,
      icon: stats.staff.trend.positive ? <TrendingUp color="success" /> : <TrendingDown color="error" />,
      color: stats.staff.trend.positive ? 'success.main' : 'error.main'
    }
  ];

  // Month and year filter state
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  // Example analytics summary data (financial metrics, per month and year)
  const analyticsByYearMonth = {
    [`${currentYear - 2}`]: [
      // Jan
      [
        { label: 'Total Earnings This Month', value: '₱ 900,000' },
        { label: 'Average Daily Revenue', value: '₱ 29,000' },
        { label: 'Highest Earning Day', value: '₱ 55,000' },
        { label: 'Pending Payments', value: '₱ 18,000' }
      ],
      // Feb
      [
        { label: 'Total Earnings This Month', value: '₱ 1,020,000' },
        { label: 'Average Daily Revenue', value: '₱ 32,900' },
        { label: 'Highest Earning Day', value: '₱ 60,000' },
        { label: 'Pending Payments', value: '₱ 21,000' }
      ]
      // ...add more months as needed...
    ],
    [`${currentYear - 1}`]: [
      [
        { label: 'Total Earnings This Month', value: '₱ 1,050,000' },
        { label: 'Average Daily Revenue', value: '₱ 33,900' },
        { label: 'Highest Earning Day', value: '₱ 65,000' },
        { label: 'Pending Payments', value: '₱ 22,000' }
      ],
      [
        { label: 'Total Earnings This Month', value: '₱ 1,180,000' },
        { label: 'Average Daily Revenue', value: '₱ 37,900' },
        { label: 'Highest Earning Day', value: '₱ 75,000' },
        { label: 'Pending Payments', value: '₱ 25,000' }
      ]
      // ...add more months as needed...
    ],
    [`${currentYear}`]: [
      [
        { label: 'Total Earnings This Month', value: '₱ 1,100,000' },
        { label: 'Average Daily Revenue', value: '₱ 35,500' },
        { label: 'Highest Earning Day', value: '₱ 70,000' },
        { label: 'Pending Payments', value: '₱ 28,000' }
      ],
      [
        { label: 'Total Earnings This Month', value: '₱ 1,245,000' },
        { label: 'Average Daily Revenue', value: '₱ 41,500' },
        { label: 'Highest Earning Day', value: '₱ 85,000' },
        { label: 'Pending Payments', value: '₱ 32,000' }
      ]
      // ...add more months as needed...
    ],
    [`${currentYear + 1}`]: [
      [
        { label: 'Total Earnings This Month', value: '₱ 1,200,000' },
        { label: 'Average Daily Revenue', value: '₱ 38,500' },
        { label: 'Highest Earning Day', value: '₱ 80,000' },
        { label: 'Pending Payments', value: '₱ 30,000' }
      ],
      [
        { label: 'Total Earnings This Month', value: '₱ 1,300,000' },
        { label: 'Average Daily Revenue', value: '₱ 43,500' },
        { label: 'Highest Earning Day', value: '₱ 90,000' },
        { label: 'Pending Payments', value: '₱ 34,000' }
      ]
      // ...add more months as needed...
    ]
  };

  const analyticsSummary =
    (analyticsByYearMonth[selectedYear] &&
      analyticsByYearMonth[selectedYear][selectedMonth]) ||
    analyticsByYearMonth[currentYear][0];

  // Chart data for financial analytics (mocked, dynamic by month/year)
  const chartDataByYearMonth = {
    [`${currentYear}-${0}`]: [
      { day: '1', earnings: 35000, pending: 5000 },
      { day: '5', earnings: 42000, pending: 3000 },
      { day: '10', earnings: 39000, pending: 4000 },
      { day: '15', earnings: 47000, pending: 2000 },
      { day: '20', earnings: 51000, pending: 6000 },
      { day: '25', earnings: 43000, pending: 3500 },
      { day: '30', earnings: 85000, pending: 10000 }
    ],
    [`${currentYear}-${1}`]: [
      { day: '1', earnings: 38000, pending: 4000 },
      { day: '5', earnings: 45000, pending: 2500 },
      { day: '10', earnings: 41000, pending: 3000 },
      { day: '15', earnings: 48000, pending: 3500 },
      { day: '20', earnings: 52000, pending: 7000 },
      { day: '25', earnings: 44000, pending: 2000 },
      { day: '28', earnings: 87000, pending: 9000 }
    ]
    // ...add more months/years as needed...
  };
  const chartKey = `${selectedYear}-${selectedMonth}`;
  const chartData = chartDataByYearMonth[chartKey] || chartDataByYearMonth[`${currentYear}-0`];

  // Dashboard layouts for each position
  const renderAdminDashboard = () => (
    <React.Fragment>
      <PageTitle title='Dashboard' />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
            Welcome back, {user?.firstName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={1}>
            {dateString}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's what's happening at your resort today.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/portal/content-management/accommodations"
          >
            Accommodations
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            to="/portal/reservations"
          >
            Reservations
          </Button>
          <Button
            variant="contained"
            color="warning"
            component={RouterLink}
            to="/portal/content-management/amenities"
          >
            Amenities
          </Button>
        </Stack>

        <Box mb={4}>
          <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
            Trends Overview
          </Typography>
          <Grid container spacing={2}>
            {trends.map((trend, idx) => (
              <Grid item xs={12} sm={6} md={3} key={trend.label}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                  <Tooltip title={`Trend for ${trend.label}`}>
                    <Box>
                      {trend.icon}
                      <Typography variant="subtitle2" color="text.secondary" mt={1}>{trend.label}</Typography>
                      <Typography variant="h6" sx={{ color: trend.color, fontWeight: 700 }}>
                        {trend.value}
                      </Typography>
                    </Box>
                  </Tooltip>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" fontWeight={700} color="warning.main" mb={2}>
            Occupancy Rate
          </Typography>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Current occupancy rate for all rooms:
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <LinearProgress
                variant="determinate"
                value={stats.rooms.occupancyRate}
                sx={{ width: '80%', height: 12, borderRadius: 6, bgcolor: '#f5f5f5' }}
                color="warning"
              />
              <Typography variant="h6" color="warning.main" fontWeight={700}>
                {stats.rooms.occupancyRate}%
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <DashboardCard
              title="Total Reservations"
              value={stats.reservations.total}
              icon={<CalendarOutlined style={{ fontSize: 28 }} />}
              color="primary"
              isLoading={isLoading}
              details={reservationDetails}
              gradient={true}
              trend={{
                icon: <TrendingUp fontSize="small" />,
                value: stats.reservations.trend.value,
                positive: stats.reservations.trend.positive
              }}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <DashboardCard
              title="Room Management"
              value={stats.rooms.total}
              subtitle="Total Rooms"
              icon={<HomeOutlined style={{ fontSize: 28 }} />}
              color="warning"
              isLoading={isLoading}
              details={roomDetails}
              gradient={true}
              trend={{
                icon: stats.rooms.trend.positive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />,
                value: stats.rooms.trend.value,
                positive: stats.rooms.trend.positive
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Staff Members"
              value={stats.staff.total}
              subtitle={`${stats.staff.active} Active`}
              icon={<TeamOutlined style={{ fontSize: 24 }} />}
              color="secondary"
              isLoading={isLoading}
              trend={{
                icon: <RiseOutlined style={{ fontSize: 12 }} />,
                value: stats.staff.trend.value,
                positive: stats.staff.trend.positive
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Total Customers"
              value={stats.customers.total}
              subtitle={`${stats.customers.new} New this month`}
              icon={<UserOutlined style={{ fontSize: 24 }} />}
              color="success"
              isLoading={isLoading}
              trend={{
                icon: <RiseOutlined style={{ fontSize: 12 }} />,
                value: stats.customers.trend.value,
                positive: stats.customers.trend.positive
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Quick Actions"
              value="4"
              subtitle="Available actions"
              icon={<TrophyOutlined style={{ fontSize: 24 }} />}
              color="info"
              onClick={() => console.log('Quick actions clicked')}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DashboardCard
              title="Performance"
              value="Excellent"
              subtitle="Overall rating"
              icon={<TrophyOutlined style={{ fontSize: 24 }} />}
              color="success"
              gradient={true}
            />
          </Grid>
        </Grid>

        <Box mt={6}>
          <Typography variant="h6" fontWeight={700} color="info.main" mb={2}>
            Financial Analytics
          </Typography>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <BarChart color="info" sx={{ fontSize: 40 }} />
              <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                Revenue Trends ({months[selectedMonth]} {selectedYear})
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={selectedMonth}
                  label="Month"
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  {months.map((m, idx) => (
                    <MenuItem key={m} value={idx}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  {years.map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: '100%', height: 260, bgcolor: '#f5f7fa', borderRadius: 2, mb: 2, p: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: '₱', angle: -90, position: 'insideLeft' }} />
                  <ReTooltip
                    formatter={(value, name) =>
                      [`₱ ${value.toLocaleString()}`, name === 'earnings' ? 'Earnings' : 'Pending Payments']
                    }
                    labelFormatter={label => `Day ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="earnings" fill="#1976d2" name="Earnings" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#f57c00" name="Pending Payments" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </Box>
            <Grid container spacing={2}>
              {analyticsSummary.map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={item.label}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                    <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="h6" color="info.main" fontWeight={700}>{item.value}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        <Box mt={6}>
          <Typography variant="h6" fontWeight={600} color="text.primary" mb={2}>
            Recent Activity
          </Typography>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
            {stats.recentActivity.map((activity, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                  {activity.type[0]}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={600}>{activity.user}</Typography>
                  <Typography variant="body2" color="text.secondary">{activity.detail}</Typography>
                </Box>
                <Typography variant="caption" color="text.disabled" sx={{ minWidth: 80, textAlign: 'right' }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>

      </Container>
    </React.Fragment>
  );

  const renderReceptionistDashboard = () => (
    <React.Fragment>
      <PageTitle title='Receptionist Dashboard' />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
            Welcome, {user?.firstName} (Receptionist)!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Today's overview and quick actions.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <DashboardCard
              title="Today's Reservations"
              value={stats.reservations.today}
              icon={<CalendarTodayOutlined />}
              color="primary"
              isLoading={isLoading}
              details={reservationDetails}
              gradient={true}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <DashboardCard
              title="Room Status"
              value={stats.rooms.occupied + ' / ' + stats.rooms.total}
              subtitle="Occupied / Total"
              icon={<HomeOutlined />}
              color="warning"
              isLoading={isLoading}
              details={roomDetails}
              gradient={true}
            />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );

  const renderCustomerDashboard = () => (
    <React.Fragment>
      <PageTitle title='Customer Dashboard' />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Box mb={4}>
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
            Welcome, {user?.firstName}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your reservations and activity.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/portal/reservations"
          >
            Reservations
          </Button>
          <Button
            variant="contained"
            color="success"
            component={RouterLink}
            to="/portal/testimonial"
          >
            Add Testimonial
          </Button>
          <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/book-now"
            >
              Book Now
            </Button>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DashboardCard
              title="Your Reservations"
              value={stats.reservations.today}
              icon={<CalendarOutlined />}
              color="primary"
              isLoading={isLoading}
              details={[
                { icon: <CalendarTodayOutlined />, label: 'Upcoming', value: stats.reservations.today },
                { icon: <CalendarMonth />, label: 'This Month', value: stats.reservations.month }
              ]}
              gradient={true}
            />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );

  // Master admin gets full dashboard
  if (isMasterAdmin || isAdmin) {
    return renderAdminDashboard();
  }
  if (isReceptionist) {
    return renderReceptionistDashboard();
  }
  if (isCustomer) {
    return renderCustomerDashboard();
  }

  // Default fallback
  return (
    <React.Fragment>
      <PageTitle title='Dashboard' />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center" mt={8}>
          No dashboard available for your position.
        </Typography>
      </Container>
    </React.Fragment>
  );
}

export default Dashboard