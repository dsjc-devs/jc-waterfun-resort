import React, { useMemo, useState } from 'react'
import { useGetReservations } from 'api/reservations';
import { Box, Button, Chip, Divider, Fade, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { EditOutlined, EllipsisOutlined, EyeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
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

const ReservationsTable = () => {
  const { user } = useAuth()
  const { isCustomer, isAdmin, isMasterAdmin } = useGetPosition()

  const { data = {}, isLoading } = useGetReservations(isCustomer ? { userId: user?.userId } : {})
  const { reservations = [] } = data || {}

  const [openMenu, setOpenMenu] = useState({ anchorEl: null, reservationId: '' })

  const navigate = useNavigate()

  const handleMenuClick = (event, reservationId) => {
    setOpenMenu({ anchorEl: event.currentTarget, reservationId })
  }

  const handleMenuClose = () => {
    setOpenMenu({ anchorEl: null, reservationId: '' })
  }

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
            <Tooltip title={`User ID: ${row?.userData?.userId}`}>
              <Typography variant="subtitle2" color="secondary.600">
                #{truncate(row?.userData?.userId, 20)}
              </Typography>
            </Tooltip>
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
            <UserOutlined /> {row?.totalGuests} Guests
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

    if (isCustomer) {
      return [reservationColumn, reservationDatesColumn, guestsColumns, statusColumn, financialsColumn, actionsColumn];
    } else {
      return [reservationColumn, customerColumn, reservationDatesColumn, guestsColumns, statusColumn, financialsColumn, actionsColumn];
    }
  }, [isCustomer]);

  return (
    <React.Fragment>
      <ReusableTable
        searchableColumns={[
          "reservationId",
          "userData.firstName",
          "userData.lastName",
          "userData.emailAddress",
          "accommodationData.name",
          "status",
        ]}
        itemsPerPage={5}
        columns={columns}
        rows={reservations}
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
                  >
                    Create Reservation
                  </Button>
                </AnimateButton>
              )}
            </React.Fragment>
          )
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

        {/* {(isAdmin || isMasterAdmin) && (
          <MenuItem
            onClick={() => {
              handleMenuClose()
            }}
          >
            <EditOutlined style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
        )} */}
      </Menu>

    </React.Fragment>
  )
}

export default ReservationsTable
