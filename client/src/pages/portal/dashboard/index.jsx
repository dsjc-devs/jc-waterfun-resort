import React, { useState } from 'react'
import PageTitle from 'components/PageTitle';
import DashboardCard from 'components/DashboardCard';
import { Grid, Box, Typography, Container, Paper, Avatar, Stack, Tooltip, LinearProgress, Select, MenuItem, FormControl, InputLabel, Button, Chip } from '@mui/material';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DownloadOutlined } from '@ant-design/icons';

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

  // Transactions by Type (Walk-in vs Online)
  const walkInCount = dashboard?.reservationsByType?.walkIn || 0;
  const onlineCount = dashboard?.reservationsByType?.online || 0;
  const transactionsByType = [
    { name: 'Walk-in', count: walkInCount },
    { name: 'Online', count: onlineCount }
  ];

  const exportTransactionsReportToPdf = () => {
    try {
      const doc = new jsPDF('p', 'pt');

      const fmt = (v) => (v === undefined || v === null || v === '' ? '-' : String(v));
      const formatDateTime = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (isNaN(d.getTime())) return fmt(value);
        return d.toLocaleString(undefined, {
          year: 'numeric', month: 'short', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        });
      };

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Transactions by Type Report', 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const periodLabel = (isMasterAdmin || isAdmin)
        ? `${monthLabel} ${selectedYear}`
        : 'Current Period';
      doc.text(`Generated: ${formatDateTime(new Date())}`, 40, 58);
      doc.text(`Period: ${periodLabel}`, 40, 72);

      // Table body
      const total = walkInCount + onlineCount;
      const body = [
        ['Walk-in', walkInCount],
        ['Online', onlineCount],
        [{ content: 'Total', styles: { fontStyle: 'bold' } }, { content: total, styles: { fontStyle: 'bold' } }]
      ];

      autoTable(doc, {
        startY: 96,
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [25, 118, 210], halign: 'center', valign: 'middle' },
        bodyStyles: { valign: 'middle' },
        head: [['Type', 'Count']],
        body
      });

      // Footer per page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.text('John Cezar Waterfun Resort • transactions report', 40, pageHeight - 16);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 100, pageHeight - 16);
      }

      doc.save('transactions-report.pdf');
    } catch (e) {
      console.error('Failed to export transactions report:', e);
    }
  };

  // Export: Full Dashboard Report (summary of reservations, occupancy, staff, customers, types)
  const exportFullDashboardReportToPdf = () => {
    try {
      const doc = new jsPDF('p', 'pt');

      const fmt = (v) => (v === undefined || v === null || v === '' ? '-' : String(v));
      const formatDateTime = (value) => {
        if (!value) return '-';
        const d = new Date(value);
        if (isNaN(d.getTime())) return fmt(value);
        return d.toLocaleString(undefined, {
          year: 'numeric', month: 'short', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        });
      };

      const periodLabel = (isMasterAdmin || isAdmin)
        ? `${monthLabel} ${selectedYear}`
        : 'Current Period';

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Resort Dashboard Report', 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated: ${formatDateTime(new Date())}`, 40, 58);
      doc.text(`Period: ${periodLabel}`, 40, 72);

      // Section: Reservations Summary
      const byStatus = dashboard?.reservationsByStatus || {};
      const byType = dashboard?.reservationsByType || {};
      const byPeriod = dashboard?.reservationsByPeriod || {};
      const totalReservations = dashboard?.totalReservations || 0;

      autoTable(doc, {
        startY: 96,
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [33, 150, 243] },
        head: [[`Reservations Summary (Total: ${totalReservations})`, 'Count']],
        body: [
          ['Confirmed', byStatus.CONFIRMED || 0],
          ['Completed', byStatus.COMPLETED || 0],
          ['Walk-in', byType.walkIn || 0],
          ['Online', byType.online || 0],
          ['Today', byPeriod.today || 0],
          ['This Week', byPeriod.thisWeek || 0],
          ['This Month', byPeriod.thisMonth || 0],
          ['This Year', byPeriod.thisYear || 0]
        ]
      });

      // Section: Occupancy
      const occ = dashboard?.occupancyRate || {};
      autoTable(doc, {
        margin: { top: 20 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [76, 175, 80] },
        head: [['Occupancy Overview', 'Value']],
        body: [
          ['Current Occupancy', occ.currentOccupancy ?? 0],
          ['Total Capacity', occ.totalCapacity ?? 0],
          ['Occupancy %', `${occ.occupancyPercentage ?? 0}%`],
          ['Occupied Rooms', occ.occupiedRooms ?? 0],
          ['Available Rooms', occ.availableRooms ?? 0]
        ]
      });

      const occTypes = Array.isArray(dashboard?.occupancyByAccommodationType)
        ? dashboard.occupancyByAccommodationType
        : [];
      if (occTypes.length) {
        autoTable(doc, {
          margin: { top: 10 },
          styles: { fontSize: 9, cellPadding: 5 },
          headStyles: { fillColor: [76, 175, 80] },
          head: [['Accommodation Type', 'Total', 'Occupied', 'Available', 'Occupancy %']],
          body: occTypes.map((t) => [
            fmt(t.accommodationType),
            fmt(t.totalCount),
            fmt(t.occupiedCount),
            fmt(t.availableCount),
            `${t.occupancyPercentage ?? 0}%`
          ])
        });
      }

      // Section: Staff
      const staff = dashboard?.staffMembers || {};
      autoTable(doc, {
        margin: { top: 20 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [156, 39, 176] },
        head: [['Staff Summary', 'Value']],
        body: [
          ['Total', staff.total ?? 0],
          ['Active', staff.active ?? 0],
          ['Inactive', staff.inactive ?? 0]
        ]
      });

      const byPos = staff.byPosition || {};
      const byPosKeys = Object.keys(byPos);
      if (byPosKeys.length) {
        autoTable(doc, {
          margin: { top: 10 },
          styles: { fontSize: 9, cellPadding: 5 },
          headStyles: { fillColor: [156, 39, 176] },
          head: [['Position', 'Total', 'Active', 'Inactive']],
          body: byPosKeys.map((k) => [
            k,
            fmt(byPos[k]?.total),
            fmt(byPos[k]?.active),
            fmt(byPos[k]?.inactive)
          ])
        });
      }

      // Section: Customers
      const cust = dashboard?.totalCustomers || {};
      autoTable(doc, {
        margin: { top: 20 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [255, 152, 0] },
        head: [['Customers Summary', 'Value']],
        body: [
          ['Total Customers', cust.total ?? 0],
          ['New This Month', cust.newThisMonth ?? 0]
        ]
      });

      // Section: Financials
      const financials = dashboard?.financialStatistics || {};
      const mr = financials.monthlyRevenue || {};
      autoTable(doc, {
        margin: { top: 20 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [3, 169, 244] },
        head: [['Monthly Revenue', 'Amount (PHP)']],
        body: [
          ['Earnings', mr.earnings ?? 0],
          ['Pending Payments', mr.pendingPayments ?? 0],
          ['Total Revenue', mr.totalRevenue ?? 0]
        ]
      });

      const rs = financials.reservationStats || {};
      autoTable(doc, {
        margin: { top: 12 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [63, 81, 181] },
        head: [['Reservation Stats', 'Value']],
        body: [
          ['Total Reservations', rs.totalReservations ?? 0],
          ['Fully Paid', rs.fullyPaidReservations ?? 0],
          ['Partially Paid', rs.partiallyPaidReservations ?? 0],
          ['Unpaid', rs.unpaidReservations ?? 0]
        ]
      });

      const sm = financials.summary || {};
      autoTable(doc, {
        margin: { top: 12 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [76, 175, 80] },
        head: [['Summary', 'Value']],
        body: [
          ['Total Earnings This Month', sm.totalEarningsThisMonth ?? 0],
          ['Average Daily Revenue', sm.averageDailyRevenue ?? 0],
          ['Average Revenue / Reservation', sm.averageRevenuePerReservation ?? 0],
          ['Pending Payments', sm.pendingPayments ?? 0],
          ['Currency', (sm.currency || 'PHP')]
        ]
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.text('John Cezar Waterfun Resort • dashboard report', 40, pageHeight - 16);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 100, pageHeight - 16);
      }

      doc.save('dashboard-report.pdf');
    } catch (e) {
      console.error('Failed to export dashboard report:', e);
    }
  };

  // Export: Financials-only report
  const exportFinancialsReportToPdf = () => {
    try {
      const doc = new jsPDF('p', 'pt');

      const fmt = (v) => (v === undefined || v === null || v === '' ? '-' : String(v));
      const financials = dashboard?.financialStatistics || {};
      const monthName = financials.monthName || monthLabel;

      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Financials Report', 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Period: ${monthName} ${financials.year || selectedYear}`, 40, 58);

      // Monthly Revenue
      const mr = financials.monthlyRevenue || {};
      autoTable(doc, {
        startY: 80,
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [3, 169, 244] },
        head: [['Monthly Revenue', 'Amount (PHP)']],
        body: [
          ['Earnings', fmt(mr.earnings)],
          ['Pending Payments', fmt(mr.pendingPayments)],
          ['Total Revenue', fmt(mr.totalRevenue)]
        ]
      });

      // Reservation Stats
      const rs = financials.reservationStats || {};
      autoTable(doc, {
        margin: { top: 16 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [63, 81, 181] },
        head: [['Reservation Stats', 'Value']],
        body: [
          ['Total Reservations', fmt(rs.totalReservations)],
          ['Fully Paid', fmt(rs.fullyPaidReservations)],
          ['Partially Paid', fmt(rs.partiallyPaidReservations)],
          ['Unpaid', fmt(rs.unpaidReservations)]
        ]
      });

      // Summary
      const sm = financials.summary || {};
      autoTable(doc, {
        margin: { top: 16 },
        styles: { fontSize: 10, cellPadding: 6 },
        headStyles: { fillColor: [76, 175, 80] },
        head: [['Summary', 'Value']],
        body: [
          ['Total Earnings This Month', fmt(sm.totalEarningsThisMonth)],
          ['Average Daily Revenue', fmt(sm.averageDailyRevenue)],
          ['Average Revenue / Reservation', fmt(sm.averageRevenuePerReservation)],
          ['Pending Payments', fmt(sm.pendingPayments)],
          ['Currency', fmt(sm.currency || 'PHP')]
        ]
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(9);
        doc.text('John Cezar Waterfun Resort • financials report', 40, pageHeight - 16);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 100, pageHeight - 16);
      }

      doc.save('financials-report.pdf');
    } catch (e) {
      console.error('Failed to export financials report:', e);
    }
  };

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

        <Box mb={4}>
          <Typography variant="h6" fontWeight={600} color="text.primary" mb={2}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/portal/content-management/accommodations"
                startIcon={<HomeOutlined />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Accommodations
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    Manage rooms & spaces
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/portal/reservations"
                startIcon={<CalendarOutlined />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(156, 39, 176, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Reservations
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    View & manage bookings
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Button
                variant="contained"
                color="warning"
                component={RouterLink}
                to="/portal/content-management/amenities"
                startIcon={<TrophyOutlined />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(245, 124, 0, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Amenities
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.8)">
                    Manage facilities
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Button
                variant="outlined"
                color="primary"
                onClick={exportFullDashboardReportToPdf}
                startIcon={<DownloadOutlined />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Dashboard Report
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Export full summary
                  </Typography>
                </Box>
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={exportFinancialsReportToPdf}
                startIcon={<BarChart />}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box textAlign="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Financials Report
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Export revenue data
                  </Typography>
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" fontWeight={700} color="warning.main" mb={2}>
            Today's Occupancy Rate
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

        {/* Transactions by Type Report */}
        <Box mt={6}>
          <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>
            Transactions by Type
          </Typography>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ width: '100%', height: 260, bgcolor: '#f5f7fa', borderRadius: 2, p: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={transactionsByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ReTooltip formatter={(value, name) => [value, 'Count']} />
                      <Bar dataKey="count" fill="#2e7d32" name="Count" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Walk-in Transactions</Typography>
                  <Typography variant="h5" color="success.main" fontWeight={700}>{walkInCount}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Online Transactions</Typography>
                  <Typography variant="h5" color="info.main" fontWeight={700}>{onlineCount}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Total</Typography>
                  <Typography variant="h5" color="text.primary" fontWeight={700}>{walkInCount + onlineCount}</Typography>
                </Paper>
                <Button variant="contained" startIcon={<DownloadOutlined />} onClick={exportTransactionsReportToPdf}>
                  Export Report (PDF)
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Reservations Summary (By Status & Period) */}
        <Box mt={6}>
          <Typography variant="h6" fontWeight={700} color="text.primary" mb={2}>
            Reservations Summary
          </Typography>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>By Status</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Confirmed: ${dashboard?.reservationsByStatus?.CONFIRMED || 0}`} color="primary" />
                  <Chip label={`Completed: ${dashboard?.reservationsByStatus?.COMPLETED || 0}`} color="success" />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>By Period</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Today: ${dashboard?.reservationsByPeriod?.today || 0}`} />
                  <Chip label={`This Week: ${dashboard?.reservationsByPeriod?.thisWeek || 0}`} />
                  <Chip label={`This Month: ${dashboard?.reservationsByPeriod?.thisMonth || 0}`} />
                  <Chip label={`This Year: ${dashboard?.reservationsByPeriod?.thisYear || 0}`} />
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Box>

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