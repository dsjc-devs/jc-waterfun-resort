import React, { useState } from 'react'
import PageTitle from 'components/PageTitle';
import DashboardCard from 'components/DashboardCard';
import { Grid, Box, Typography, Container, Paper, Avatar, Stack, Tooltip, LinearProgress, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import {
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  TrophyOutlined,
  RiseOutlined
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
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid } from 'recharts';
import useGetPosition from 'hooks/useGetPosition';
import { Link as RouterLink } from 'react-router-dom';
import useDashboardStats from 'hooks/useDashboardStats';

const Dashboard = () => {
  const { user } = useAuth();
  const { isAdmin, isCustomer, isMasterAdmin, isReceptionist } = useGetPosition()
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const query = (isMasterAdmin || isAdmin)
    ? { month: selectedMonth, year: selectedYear }
    : {};

  const { stats, dashboard, isLoading } = useDashboardStats(query);

  const formatCurrency = (amount = 0) => {
    const numeric = Number(amount) || 0;
    return `₱ ${numeric.toLocaleString()}`;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
  const monthLabel = stats.financial.monthName || months[selectedMonth - 1] || months[today.getMonth()];

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
  const analyticsSummary = [
    {
      label: 'Total Earnings This Month',
      value: formatCurrency(stats.financial.summary.totalEarningsThisMonth)
    },
    {
      label: 'Average Daily Revenue',
      value: formatCurrency(stats.financial.summary.averageDailyRevenue)
    },
    {
      label: 'Average Revenue / Reservation',
      value: formatCurrency(stats.financial.summary.averageRevenuePerReservation)
    },
    {
      label: 'Pending Payments',
      value: formatCurrency(stats.financial.summary.pendingPayments)
    }
  ];

  const chartData = [
    {
      name: 'Earnings',
      amount: stats.financial.monthlyRevenue.earnings
    },
    {
      name: 'Pending Payments',
      amount: stats.financial.monthlyRevenue.pendingPayments
    },
    {
      name: 'Total Revenue',
      amount: stats.financial.monthlyRevenue.totalRevenue
    }
  ];

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

          <Grid item xs={12} md={6} lg={6}>
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

          <Grid item xs={12} md={6} lg={6}>
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
        </Grid>

        <Box mt={6}>
          <Typography variant="h6" fontWeight={700} color="info.main" mb={2}>
            Financial Analytics
          </Typography>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <BarChart color="info" sx={{ fontSize: 40 }} />
              <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1 }}>
                Revenue Trends ({monthLabel} {selectedYear})
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={selectedMonth}
                  label="Month"
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map((m, idx) => (
                    <MenuItem key={m} value={idx + 1}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={selectedYear}
                  label="Year"
                  onChange={e => setSelectedYear(Number(e.target.value))}
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
                  <XAxis dataKey="name" label={{ value: 'Category', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Amount (₱)', angle: -90, position: 'insideLeft' }} />
                  <ReTooltip
                    formatter={(value, name, entry) => [formatCurrency(value), entry?.payload?.name || name]}
                    labelFormatter={() => stats.financial.monthName || monthLabel}
                  />
                  <Bar dataKey="amount" fill="#1976d2" name="Amount" radius={[4, 4, 0, 0]} />
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