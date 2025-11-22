import React, { useMemo, useState, useEffect } from 'react'
import reservationsApi, { useGetReservations } from 'api/reservations';
import {
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  Pagination,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Grid,
  Collapse,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  PlusOutlined,
  UserOutlined,
  FilterOutlined,
  ClearOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { truncate } from 'lodash';
import { toast } from 'react-toastify';
import { DownloadOutlined } from '@ant-design/icons';

import ReusableTable from 'components/ReusableTable'
import axiosServices from 'utils/axios'
import Avatar from 'components/@extended/Avatar';
import formatPeso from 'utils/formatPrice';
import titleCase from 'utils/titleCaseFormatter';
import useAuth from 'hooks/useAuth';
import ConvertDate from 'components/ConvertDate';
import IconButton from 'components/@extended/IconButton';
import useGetPosition from 'hooks/useGetPosition';
import AnimateButton from 'components/@extended/AnimateButton';
import textFormatter from 'utils/textFormatter';
import ConfirmationDialog from 'components/ConfirmationDialog';
import exportReservationToPdf from 'utils/exportReservationPdf';
import { exportToPDF } from 'utils/exportToPDF';

const ReservationsTable = () => {
  const theme = useTheme()
  const { user } = useAuth()
  const { isCustomer, isAdmin, isMasterAdmin, isReceptionist } = useGetPosition()

  // Server pagination state
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const baseQuery = isCustomer ? { userId: user?.userId } : {}
  const { data = {}, isLoading, mutate } = useGetReservations({ ...baseQuery, page, limit })
  const { reservations = [], totalPages = 1, currentPage = 1 } = data || {}

  const [openMenu, setOpenMenu] = useState({ anchorEl: null, reservationId: '' })
  const [selectedReservationId, setSelectedReservationId] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    rescheduleStatus: '',
    reservationType: '',
    startDate: '',
    endDate: '',
    customer: '',
    accommodationType: '',
    minAmount: '',
    maxAmount: '',
    dateRange: ''
  })
  // Global search state (server-side like experience)
  const [globalSearch, setGlobalSearch] = useState('')
  const [allReservations, setAllReservations] = useState([])
  const [loadingAll, setLoadingAll] = useState(false)

  // Fetch all reservations once (for global search) when user starts searching
  useEffect(() => {
    const fetchAll = async () => {
      if (!globalSearch) return; // only load when searching
      // Avoid refetch if already loaded and not empty
      if (allReservations.length) return;
      try {
        setLoadingAll(true)
        // First request without page/limit to use defaults and get totalReservations
        const firstRes = await axiosServices.get(`/${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/reservations`)
        const total = firstRes?.data?.totalReservations || 0
        let accumulated = firstRes?.data?.reservations || []
        const pages = firstRes?.data?.totalPages || 1
        // If more than 1 page, fetch remaining pages sequentially
        for (let p = 2; p <= pages; p++) {
          const resp = await axiosServices.get(`/${import.meta.env.VITE_API_KEY_}/${import.meta.env.VITE_API_VER}/reservations?page=${p}&limit=${firstRes?.data?.reservations?.length || 10}`)
          accumulated = accumulated.concat(resp?.data?.reservations || [])
        }
        setAllReservations(accumulated)
      } catch (e) {
        console.error('Failed to fetch all reservations for search', e)
      } finally {
        setLoadingAll(false)
      }
    }
    fetchAll()
  }, [globalSearch, allReservations.length])

  const navigate = useNavigate()

  const handleMenuClick = (event, reservationId) => {
    setOpenMenu({ anchorEl: event.currentTarget, reservationId })
    setSelectedReservationId(reservationId)
  }

  const handleMenuClose = () => {
    setOpenMenu({ anchorEl: null, reservationId: '' })
  }

  const [isMarkingPaid, setIsMarkingPaid] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleMarkFullyPaid = async () => {
    try {
      const row = reservations.find(r => r.reservationId === selectedReservationId)
      if (!row) return
      const alreadyFull = (row?.amount?.totalPaid || 0) >= (row?.amount?.total || 0)
      if (alreadyFull) {
        setConfirmOpen(false)
        return handleMenuClose()
      }
      setIsMarkingPaid(true)
      const newAmount = { ...(row.amount || {}), totalPaid: row?.amount?.total || 0 }
      await reservationsApi.Reservations.editReservation(row.reservationId, { amount: newAmount })
      await mutate()
      toast.success('Marked as fully paid.')
    } catch (e) {
      console.error('Failed to mark as fully paid:', e)
      toast.error(e?.message || 'Failed to mark as fully paid.')
    } finally {
      setIsMarkingPaid(false)
      setConfirmOpen(false)
      handleMenuClose()
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      rescheduleStatus: '',
      reservationType: '',
      startDate: '',
      endDate: '',
      customer: '',
      accommodationType: '',
      minAmount: '',
      maxAmount: '',
      dateRange: 'all'
    })
  }

  const filterOptions = useMemo(() => {
    const statuses = [...new Set(reservations.map(r => r.status))].filter(Boolean)
    const accommodationTypes = [...new Set(reservations.map(r => r.accommodationData?.name))].filter(Boolean)
    const customers = [...new Set(reservations.map(r => `${r.userData?.firstName} ${r.userData?.lastName}`))].filter(Boolean)
    const rescheduleStatuses = [...new Set(reservations.map(r => r?.rescheduleRequest?.status || 'NONE'))]

    return { statuses, accommodationTypes, customers, rescheduleStatuses }
  }, [reservations])

  const filteredReservations = useMemo(() => {
    const source = globalSearch && allReservations.length ? allReservations : reservations
    return source.filter(reservation => {
      if (filters.status === 'not-completed') {
        if (reservation.status === 'COMPLETED') return false;
      } else if (filters.status && reservation.status !== filters.status) {
        return false;
      }

      if (filters.paymentStatus) {
        const now = new Date();
        const endDate = new Date(reservation?.endDate);
        let paymentsStatusLabel;
        if (reservation?.amount?.totalPaid >= reservation?.amount?.total) {
          paymentsStatusLabel = 'FULLY_PAID';
        } else if (reservation?.amount?.totalPaid > 0) {
          // If end date has passed and still partially paid, mark as UNPAID
          if (endDate < now) {
            paymentsStatusLabel = 'UNPAID';
          } else {
            paymentsStatusLabel = 'PARTIALLY_PAID';
          }
        } else {
          paymentsStatusLabel = 'UNPAID';
        }
        if (paymentsStatusLabel !== filters.paymentStatus) return false;
      }

      if (filters.customer) {
        const customerName = `${reservation.userData?.firstName} ${reservation.userData?.lastName}`.toLowerCase()
        if (!customerName.includes(filters.customer.toLowerCase())) return false
      }

      if (filters.accommodationType && reservation.accommodationData?.name !== filters.accommodationType) return false

      if (filters.rescheduleStatus) {
        const current = reservation?.rescheduleRequest?.status || 'NONE'
        if (current !== filters.rescheduleStatus) return false
      }

      if (filters.reservationType) {
        const isReservation = reservation?.isWalkIn === false;
        if (filters.reservationType === 'Via Online' && !isReservation) return false;
        if (filters.reservationType === 'Walk-In' && isReservation) return false;
      }

      if (filters.minAmount && reservation.amount?.total < parseFloat(filters.minAmount)) return false
      if (filters.maxAmount && reservation.amount?.total > parseFloat(filters.maxAmount)) return false

      if (filters.dateRange && filters.dateRange !== 'all') {
        const reservationDate = new Date(reservation.startDate)
        const today = new Date()

        today.setHours(0, 0, 0, 0)
        reservationDate.setHours(0, 0, 0, 0)

        switch (filters.dateRange) {
          case 'today':
            if (reservationDate.getTime() !== today.getTime()) return false
            break
          case 'thisWeek':
            const currentWeekStart = new Date(today)
            currentWeekStart.setDate(today.getDate() - today.getDay())

            const currentWeekEnd = new Date(currentWeekStart)
            currentWeekEnd.setDate(currentWeekStart.getDate() + 6)

            if (reservationDate < currentWeekStart || reservationDate > currentWeekEnd) return false
            break
          case 'thisMonth':
            if (reservationDate.getMonth() !== today.getMonth() || reservationDate.getFullYear() !== today.getFullYear()) return false
            break
          case 'custom':
            if (filters.startDate) {
              const filterStartDate = new Date(filters.startDate)
              filterStartDate.setHours(0, 0, 0, 0)
              if (reservationDate < filterStartDate) return false
            }
            if (filters.endDate) {
              const filterEndDate = new Date(filters.endDate)
              if (reservationDate > filterEndDate) return false
            }
            break
        }
      }

      // Global text search across key fields when globalSearch active
      if (globalSearch) {
        const haystack = [
          reservation.reservationId,
          reservation.userData?.firstName,
          reservation.userData?.lastName,
          reservation.userData?.emailAddress,
          reservation.accommodationData?.name,
          reservation.status,
          reservation.rescheduleRequest?.status
        ].map(v => String(v || '').toLowerCase()).join(' ')
        if (!haystack.includes(globalSearch.toLowerCase())) return false
      }

      return true
    })
  }, [reservations, filters, globalSearch, allReservations])

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== 'all').length

  const columns = useMemo(() => {
    const reservationColumn = {
      id: 'reservationId',
      align: 'left',
      disablePadding: true,
      label: 'Reservation',
      renderCell: (row) => (
        <Stack direction='row' alignItems='center' spacing={2}>
          <Box>
            <Avatar
              variant='rectangle'
              size='lg'
              src={row?.accommodationData?.thumbnail}
            />
          </Box>
          <Box>
            <Typography
              variant='subtitle2'
              sx={{
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              ID: #{row?.reservationId}
            </Typography>
            <Typography variant='subtitle2'>
              {row?.accommodationData?.name}
            </Typography>
            <Typography variant='subtitle2' color='success.main'>
              {formatPeso(row?.amount?.accommodationTotal)}
            </Typography>
          </Box>
        </Stack >
      )
    };

    const reservationDatesColumn = {
      id: 'reservationDates',
      label: 'Reservation Dates',
      align: 'center',
      renderCell: (row) => (
        <Stack spacing={1} alignItems="center">
          <Typography variant='subtitle2'>
            Start Date: <ConvertDate dateString={row?.startDate} time />
          </Typography>
          <Typography variant='subtitle2'>
            End Date: <ConvertDate dateString={row?.endDate} time />
          </Typography>
        </Stack>
      )
    };

    const financialsColumn = {
      id: 'financials',
      label: isCustomer ? 'Payment' : 'Financials',
      align: 'center',
      renderCell: (row) => {
        const now = new Date();
        const endDate = new Date(row?.endDate);
        let paymentsStatusLabel;
        if (row?.amount?.totalPaid >= row?.amount?.total) {
          paymentsStatusLabel = 'FULLY_PAID';
        } else if (row?.amount?.totalPaid > 0) {
          if (endDate < now) {
            paymentsStatusLabel = 'UNPAID';
          } else {
            paymentsStatusLabel = 'PARTIALLY_PAID';
          }
        } else {
          paymentsStatusLabel = 'UNPAID';
        }

        return (
          <Stack textAlign='left'>
            <Chip
              size='small'
              label={textFormatter.fromSlug(titleCase(paymentsStatusLabel))}
              color={{
                FULLY_PAID: 'success',
                PARTIALLY_PAID: 'primary',
                UNPAID: 'error'
              }[paymentsStatusLabel] || 'default'}
            />
            <Typography variant="body2">Accommodation Total: {formatPeso(row?.amount?.accommodationTotal)}</Typography>
            <Typography variant="body2">Entrance Total: {formatPeso(row?.amount?.entranceTotal)}</Typography>
            <Typography variant="body2">Minimum Payable: {formatPeso(row?.amount?.minimumPayable)}</Typography>
            <Typography variant="body2">Total: {formatPeso(row?.amount?.total)}</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2" color="success.dark">Paid: {formatPeso(row?.amount?.totalPaid)}</Typography>
            <Divider sx={{ mb: 1 }} />
            <Typography variant="body2" color="error">
              Balance: {formatPeso(row?.amount?.total - row?.amount?.totalPaid)}
            </Typography>
          </Stack>
        )
      }
    };

    const customerColumn = {
      id: 'userData',
      align: 'left',
      disablePadding: true,
      label: 'Customer',
      renderCell: (row) => (
        <Stack flexDirection="row" gap={2} alignItems="center">
          <Box>
            <Avatar size="lg" src={row?.userData?.avatar} />
          </Box>
          <Box>
            {row?.userData?.userId && (
              <Tooltip title={`User ID: ${row?.userData?.userId}`}>
                <Typography variant="subtitle2" color="secondary.600">
                  #{truncate(row?.userData?.userId, 20)}
                </Typography>
              </Tooltip>
            )}
            <Typography variant="subtitle1">
              {row?.userData?.firstName} {row?.userData?.lastName}
            </Typography>
            <Typography variant="subtitle2" color="primary">
              {row?.userData?.emailAddress}
            </Typography>
          </Box>
        </Stack>
      )
    };

    const guestsColumns = {
      id: 'guests',
      label: 'Guests',
      align: 'center',
      renderCell: (row) => {
        return (
          <Typography variant="body2">
            <UserOutlined /> {row?.guests} Guests
          </Typography>
        );
      }
    };

    const statusColumn = {
      id: 'status',
      label: 'Status',
      align: 'center',
      renderCell: (row) => {
        return (
          <Chip
            size='small'
            label={titleCase(row?.status)}
            color={{
              PENDING: 'warning',
              CONFIRMED: 'primary',
              COMPLETED: 'success',
              RESCHEDULED: 'info',
              ARCHIVED: 'error'
            }[row?.status] || 'default'}
          />
        );
      }
    };

    const isReservationColumn = {
      id: 'reservationType',
      label: 'Reservation Type',
      align: 'center',
      renderCell: (row) => {
        const isReservation = row?.isWalkIn === false; // true if not walk-in
        return (
          <Chip
            size='small'
            label={isReservation ? 'Via Online' : 'Walk-In'}
            color={isReservation ? 'success' : 'default'}
            variant={isReservation ? 'filled' : 'outlined'}
          />
        );
      }
    };

    const rescheduleColumn = {
      id: 'reschedule',
      label: 'Reschedule',
      align: 'center',
      renderCell: (row) => {
        const status = row?.rescheduleRequest?.status || 'NONE'
        const label = status === 'NONE' ? 'None' : titleCase(status)
        const color = {
          PENDING: 'warning',
          APPROVED: 'success',
          REJECTED: 'error',
          NONE: 'default'
        }[status] || 'default'
        return <Chip size='small' label={label} color={color} />
      }
    }

    const actionsColumn = {
      id: 'actions',
      align: 'center',
      disablePadding: false,
      label: '',
      renderCell: (row) => {

        return (
          <IconButton
            onClick={(e) => handleMenuClick(e, row?.reservationId)}
          >
            <EllipsisOutlined />
          </IconButton>
        )
      }
    }

    const dateCreatedColumn = {
      id: 'createdAt',
      align: 'center',
      disablePadding: false,
      label: 'Date Created',
      renderCell: (row) => {

        return (
          <Typography variant="subtitle2">
            <ConvertDate dateString={row?.createdAt} time={true} />
          </Typography>
        )
      }
    }

    if (isCustomer) {
      return [reservationColumn, reservationDatesColumn, dateCreatedColumn, guestsColumns, statusColumn, isReservationColumn, rescheduleColumn, financialsColumn, actionsColumn];
    } else {
      return [reservationColumn, customerColumn, reservationDatesColumn, dateCreatedColumn, guestsColumns, statusColumn, isReservationColumn, rescheduleColumn, financialsColumn, actionsColumn];
    }
  }, [isCustomer])

  // Bulk export function (table-style; uses one table across pages)
  const handleBulkExportToPdf = async () => {
    if (!filteredReservations.length) return;

    try {
      const peso = (value) => {
        const num = Number(value || 0);
        try {
          const formatted = new Intl.NumberFormat('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(num);
          return `₱${formatted}`;
        } catch (e) {
          const fixed = (isFinite(num) ? num : 0).toFixed(2);
          return `₱${fixed}`;
        }
      };

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

      // Create summary statistics
      const totalReservations = filteredReservations.length;
      const totalRevenue = filteredReservations.reduce((sum, res) => sum + (res?.amount?.total || 0), 0);
      const totalPaid = filteredReservations.reduce((sum, res) => sum + (res?.amount?.totalPaid || 0), 0);
      const pendingAmount = totalRevenue - totalPaid;

      const statusCounts = filteredReservations.reduce((acc, res) => {
        acc[res.status] = (acc[res.status] || 0) + 1;
        return acc;
      }, {});

      // Prepare table data
      const tableRows = filteredReservations.map(reservation => {
        const customerName = `${fmt(reservation?.userData?.firstName)} ${fmt(reservation?.userData?.lastName)}`.trim();
        const paymentStatus = (reservation?.amount?.totalPaid || 0) >= (reservation?.amount?.total || 0)
          ? 'Fully Paid' : ((reservation?.amount?.totalPaid || 0) > 0 ? 'Partially Paid' : 'Unpaid');
        const isReservation = reservation?.isWalkIn === false;
        const reservationTypeLabel = isReservation ? 'Via Online' : 'Walk-In';

        return [
          fmt(reservation?.reservationId),
          customerName || '-',
          fmt(reservation?.userData?.emailAddress),
          fmt(reservation?.accommodationData?.name),
          fmt(reservation?.guests),
          formatDateTime(reservation?.startDate),
          formatDateTime(reservation?.endDate),
          fmt(reservation?.status),
          reservationTypeLabel,
          paymentStatus,
          peso(reservation?.amount?.total),
          peso(reservation?.amount?.totalPaid),
          peso((reservation?.amount?.total || 0) - (reservation?.amount?.totalPaid || 0)),
          formatDateTime(reservation?.createdAt)
        ];
      });

      await exportToPDF({
        fileName: 'reservations-bulk-export.pdf',
        title: 'Reservations Report',
        subtitle: `Bulk Export - ${totalReservations} reservations`,
        orientation: 'l', // Landscape for better table viewing
        preparedBy: user,
        sections: [
          {
            heading: 'Summary Statistics',
            keyValues: [
              ['Total Reservations', totalReservations],
              ['Total Revenue', peso(totalRevenue)],
              ['Total Paid', peso(totalPaid)],
              ['Pending Amount', peso(pendingAmount)],
              ['Confirmed', statusCounts.CONFIRMED || 0],
              ['Completed', statusCounts.COMPLETED || 0],
              ['Pending', statusCounts.PENDING || 0],
              ['Cancelled', statusCounts.CANCELLED || 0]
            ]
          },
          {
            heading: 'Reservations Details',
            table: {
              head: [
                'ID',
                'Customer',
                'Email',
                'Accommodation',
                'Guests',
                'Start Date',
                'End Date',
                'Status',
                'Type',
                'Payment',
                'Total',
                'Paid',
                'Balance',
                'Created At'
              ],
              rows: tableRows
            }
          }
        ],
        footerNote: `Export contains ${totalReservations} reservations with current filters applied. Generated for internal use.`
      });

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export reservations. Please try again.');
    }
  };

  return (
    <React.Fragment>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
          borderRadius: 2,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
        }}
      >
        <Box
          sx={{
            p: 2,
            background: alpha(theme.palette.primary.main, 0.04),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterOutlined style={{ color: theme.palette.primary.main, fontSize: '1.2rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Advanced Filters
              </Typography>
              {activeFiltersCount > 0 && (
                <Chip
                  label={`${activeFiltersCount} active`}
                  size="small"
                  color="primary"
                  variant="filled"
                  sx={{
                    fontWeight: 600,
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "contained" : "outlined"}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2
                }}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  startIcon={<ClearOutlined />}
                  onClick={clearAllFilters}
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2
                  }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        <Collapse in={showFilters}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary, fontWeight: 600 }}>
                  Status & Payment Filters
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="not-completed">
                      <Chip size="small" label="Not Completed" color="primary" />
                    </MenuItem>
                    <MenuItem value="">All Statuses</MenuItem>
                    {filterOptions.statuses.map(status => (
                      <MenuItem key={status} value={status}>
                        <Chip
                          size="small"
                          label={titleCase(status)}
                          color={{
                            PENDING: 'warning',
                            CONFIRMED: 'primary',
                            COMPLETED: 'success',
                            RESCHEDULED: 'info',
                            ARCHIVED: 'error'
                          }[status] || 'default'}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Payment Status</InputLabel>
                  <Select
                    value={filters.paymentStatus}
                    label="Payment Status"
                    onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Payment Statuses</MenuItem>
                    <MenuItem value="FULLY_PAID">
                      <Chip size="small" label="Fully Paid" color="success" />
                    </MenuItem>
                    <MenuItem value="PARTIALLY_PAID">
                      <Chip size="small" label="Partially Paid" color="primary" />
                    </MenuItem>
                    <MenuItem value="UNPAID">
                      <Chip size="small" label="Unpaid" color="error" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Reschedule</InputLabel>
                  <Select
                    value={filters.rescheduleStatus}
                    label="Reschedule"
                    onChange={(e) => handleFilterChange('rescheduleStatus', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {filterOptions.rescheduleStatuses.map(status => (
                      <MenuItem key={status} value={status}>
                        {status === 'NONE' ? (
                          <Chip size="small" label="None" variant="outlined" />
                        ) : (
                          <Chip
                            size="small"
                            label={titleCase(status)}
                            color={{ PENDING: 'warning', APPROVED: 'success', REJECTED: 'error' }[status] || 'default'}
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={filters.dateRange}
                    label="Date Range"
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="thisWeek">This Week</MenuItem>
                    <MenuItem value="thisMonth">This Month</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Accommodation</InputLabel>
                  <Select
                    value={filters.accommodationType}
                    label="Accommodation"
                    onChange={(e) => handleFilterChange('accommodationType', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Accommodations</MenuItem>
                    {filterOptions.accommodationTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Reservation Type</InputLabel>
                  <Select
                    value={filters.reservationType}
                    label="Reservation Type"
                    onChange={(e) => handleFilterChange('reservationType', e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Via Online">
                      <Chip size="small" label="Via Online" color="success" />
                    </MenuItem>
                    <MenuItem value="Walk-In">
                      <Chip size="small" label="Walk-In" variant="outlined" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary, fontWeight: 600 }}>
                  Additional Filters
                </Typography>
              </Grid>

              {!isCustomer && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer Name"
                    value={filters.customer}
                    onChange={(e) => handleFilterChange('customer', e.target.value)}
                    placeholder="Search by customer name"
                    sx={{
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                    InputProps={{
                      startAdornment: <UserOutlined style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min Amount"
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  placeholder="₱0"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: <DollarOutlined style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Amount"
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  placeholder="₱999999"
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                  }}
                  InputProps={{
                    startAdornment: <DollarOutlined style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                  }}
                />
              </Grid>

              {filters.dateRange === 'custom' && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.text.secondary, fontWeight: 600 }}>
                      Custom Date Range
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Start Date"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                      }}
                      InputProps={{
                        startAdornment: <CalendarOutlined style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="End Date"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 2 }
                      }}
                      InputProps={{
                        startAdornment: <CalendarOutlined style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Collapse>
      </Paper>

      {/* Action bar with global search & summary */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
        <TextField
          size='small'
          placeholder='Global search reservations...'
          value={globalSearch}
          onChange={(e) => { setGlobalSearch(e.target.value); setPage(1); }}
          sx={{ width: { xs: '100%', sm: 320 } }}
          InputProps={{
            startAdornment: <UserOutlined style={{ marginRight: 8, color: theme.palette.text.secondary }} />
          }}
        />
        <Typography variant='caption' sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {globalSearch && loadingAll ? 'Searching…' : `Showing ${Math.min(page * limit, (data?.totalReservations || 0)) || filteredReservations.length} of ${data?.totalReservations || filteredReservations.length} reservations`}
        </Typography>
      </Box>
      <ReusableTable
        searchableColumns={[
          "reservationId",
          "userData.firstName",
          "userData.lastName",
          "userData.emailAddress",
          "accommodationData.name",
          "status",
          "rescheduleRequest.status",
        ]}
        columns={columns}
        rows={filteredReservations}
        isLoading={isLoading || (globalSearch && loadingAll)}
        noMessage="No reservations found."
        settings={{
          otherActionButton: (
            <React.Fragment>
              <AnimateButton>
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<DownloadOutlined />}
                  onClick={handleBulkExportToPdf}
                  sx={{ mr: 1 }}
                >
                  Bulk Export to PDF
                </Button>
              </AnimateButton>
              {!isCustomer && (
                <AnimateButton>
                  <Button
                    variant='contained'
                    startIcon={<PlusOutlined />}
                    onClick={() => navigate('/portal/reservations/form')}
                  >
                    Create Reservation
                  </Button>
                </AnimateButton>
              )}
            </React.Fragment>
          ),
          order: 'desc',
          // Disable local pagination; we are using server pagination with API
          disablePagination: true,
          hideSearch: true,
        }}
      />

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Box>
      )}

      <Menu
        anchorEl={openMenu.anchorEl}
        open={Boolean(openMenu.anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            navigate(`/portal/reservations/details/${openMenu.reservationId}`)
          }}
        >
          <EyeOutlined style={{ marginRight: 8 }} />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            const row = reservations.find(r => r.reservationId === openMenu.reservationId)
            if (row) {
              exportReservationToPdf(row, 'Show this to the receptionist upon entry to verify your reservation.')
            }
            handleMenuClose()
          }}
        >
          <DownloadOutlined style={{ marginRight: 8 }} />
          Export to PDF
        </MenuItem>

        {!isCustomer && (
          <MenuItem
            onClick={() => {
              navigate(`/portal/reservations/form?isEditMode=true&reservationId=${openMenu.reservationId}`)
            }}
          >
            <EditOutlined style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
        )}

        {(isAdmin || isReceptionist || isMasterAdmin) && (() => {
          const row = reservations.find(r => r.reservationId === openMenu.reservationId)
          const canMark = row && (row?.amount?.totalPaid || 0) < (row?.amount?.total || 0)
          return canMark ? (
            <MenuItem onClick={() => { setConfirmOpen(true); }} disabled={isMarkingPaid}>
              <DollarOutlined style={{ marginRight: 8 }} />
              Mark as Fully Paid
            </MenuItem>
          ) : null
        })()}
      </Menu>

      <ConfirmationDialog
        open={confirmOpen}
        handleClose={() => setConfirmOpen(false)}
        title="Mark as Fully Paid"
        description={`Are you sure you want to mark reservation #${selectedReservationId} as fully paid? This will set Total Paid equal to Total.`}
        handleConfirm={handleMarkFullyPaid}
      />

    </React.Fragment>
  )
}

export default ReservationsTable
