import React, { useMemo, useState } from 'react'
import reservationsApi, { useGetReservations } from 'api/reservations';
import {
  Box,
  Button,
  Chip,
  Divider,
  Fade,
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

import ReusableTable from 'components/ReusableTable'
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
import { toast } from 'react-toastify';

const ReservationsTable = () => {
  const theme = useTheme()
  const { user } = useAuth()
  const { isCustomer, isAdmin, isMasterAdmin } = useGetPosition()

  const { data = {}, isLoading, mutate } = useGetReservations(isCustomer ? { userId: user?.userId } : {})
  const { reservations = [] } = data || {}

  const [openMenu, setOpenMenu] = useState({ anchorEl: null, reservationId: '' })
  const [selectedReservationId, setSelectedReservationId] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    rescheduleStatus: '',
    startDate: '',
    endDate: '',
    customer: '',
    accommodationType: '',
    minAmount: '',
    maxAmount: '',
    dateRange: 'all'
  })

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
    return reservations.filter(reservation => {
      if (filters.status && reservation.status !== filters.status) return false

      if (filters.paymentStatus) {
        const paymentsStatus = reservation?.amount?.totalPaid >= reservation?.amount?.total
        const paymentsStatusLabel = paymentsStatus ? 'FULLY_PAID' : (reservation?.amount?.totalPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID')
        if (paymentsStatusLabel !== filters.paymentStatus) return false
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

      return true
    })
  }, [reservations, filters])

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
        const paymentsStatus = row?.amount?.totalPaid >= row?.amount?.total
        const paymentsStatusLabel = paymentsStatus ? 'FULLY_PAID' : (row?.amount?.totalPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID')

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
      return [reservationColumn, reservationDatesColumn, dateCreatedColumn, guestsColumns, statusColumn, rescheduleColumn, financialsColumn, actionsColumn];
    } else {
      return [reservationColumn, customerColumn, reservationDatesColumn, dateCreatedColumn, guestsColumns, statusColumn, rescheduleColumn, financialsColumn, actionsColumn];
    }
  }, [isCustomer]);

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
        itemsPerPage={5}
        columns={columns}
        rows={filteredReservations}
        isLoading={isLoading}
        noMessage="No reservations found."
        settings={{
          otherActionButton: (
            <React.Fragment>
              {(isAdmin || isMasterAdmin) && (
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
        }}
      />

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

        {(isAdmin || isMasterAdmin) && (
          <MenuItem
            onClick={() => {
              navigate(`/portal/reservations/form?isEditMode=true&reservationId=${openMenu.reservationId}`)
            }}
          >
            <EditOutlined style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
        )}

        {(isAdmin || isMasterAdmin) && (() => {
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
