import React, { useMemo, useState } from 'react'
import { useGetUsers } from 'api/users'
import { useNavigate } from 'react-router'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { useSnackbar } from 'contexts/SnackbarContext'
import { USER_TYPES } from 'constants/constants'
import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material'

import Avatar from 'components/@extended/Avatar'
import IconButton from 'components/@extended/IconButton'
import ConvertDate from 'components/ConvertDate'
import useAuth from 'hooks/useAuth'
import ConfirmationDialog from 'components/ConfirmationDialog'
import agent from 'api'
import Table from 'components/Table'

const CustomersTable = ({ queryObj = {} }) => {
  const { data, isLoading, mutate } = useGetUsers({ queryObj });
  const { users } = data || {}

  const { user } = useAuth()
  const { openSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [deleteConfigs, setDeleteConfigs] = useState({
    open: false,
    userId: ''
  })

  const handleOpen = (userId) => {
    setDeleteConfigs({ open, userId })
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await agent.Users.deleteUser(deleteConfigs.userId)
      openSnackbar({
        message: `Deleted successfully.`,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        alert: { color: 'success' },
        duration: 3000
      });
    } catch (error) {
      openSnackbar({
        message: error,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        alert: { color: 'error' },
        duration: 3000
      });
    } finally {
      setLoading(false)
      setDeleteConfigs({ open: false, userId: '' })
      await mutate()
    }
  }

  const columns = useMemo(() => [
    {
      id: 'userId',
      align: 'left',
      disablePadding: true,
      label: 'Name',
      renderCell: (row) => (
        <Stack flexDirection='row' gap={2} alignItems='center'>
          <Box>
            <Avatar
              size='lg'
              src={row?.avatar}
            />
          </Box>
          <Box>
            <Typography variant='subtitle2' color="secondary.600"> #{row.userId} </Typography>
            <Typography variant='subtitle1'> {row.firstName} {row.lastName} </Typography>
            <Typography variant='subtitle2' color="primary"> {row.emailAddress} </Typography>
          </Box>
        </Stack >
      )
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: true,
      label: 'Status',
      renderCell: (row) => {
        const { status } = row || {}

        return (
          <Chip
            sx={{ width: "150px" }}
            label={<Typography variant='subtitle1'>
              {{
                ACTIVE: 'Active',
                INACTIVE: 'Inactive'
              }[status]}
            </Typography>}
            color={{
              ACTIVE: 'primary',
              INACTIVE: 'error'
            }[status] || 'default'}
          />
        )
      }
    },
    {
      id: 'createdAt',
      align: 'left',
      disablePadding: true,
      label: 'Date Created',
      renderCell: (row) => (
        <Typography>
          <ConvertDate dateString={row.createdAt} />
        </Typography>
      )
    },
    {
      id: 'actions',
      align: 'center',
      disablePadding: false,
      label: 'Actions',
      renderCell: (row) => {
        const { userId } = row || {}
        const _position = user?.position[0]?.value
        const hasAccess = _position === USER_TYPES[0].value

        return (
          <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
            <Tooltip title='View'>
              <IconButton color='primary' onClick={() => navigate(`/portal/customers/details/${userId}`)}>
                <EyeOutlined />
              </IconButton>
            </Tooltip>
            {hasAccess && (
              <React.Fragment>
                <Box>
                  <IconButton color='info'>
                    <EditOutlined />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton onClick={() => handleOpen(userId)} color='error' disabled={!hasAccess}>
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              </React.Fragment>
            )}
          </Stack>
        )
      }
    },
  ], [user])

  return (
    <React.Fragment>
      <Table
        searchableColumns={["emailAddress", "firstName", "lastName", "userId"]}
        itemsPerPage={1}
        columns={columns}
        rows={users || []}
        isLoading={isLoading || loading}
        settings={{
          order: 'asc',
          orderBy: 'createdAt',
          otherActionButton: (
            <Button
              variant='contained'
              startIcon={<PlusOutlined />}
              onClick={() => alert(`test`)}
              sx={{ width: '150px' }}
            >
              Add Customer
            </Button>
          )
        }}
      />

      <ConfirmationDialog
        title='Delete User'
        description='Are you sure you want to delete this user?'
        handleConfirm={handleDelete}
        open={deleteConfigs.open}
        handleClose={() => setDeleteConfigs({ ...deleteConfigs, open: false })}
      />
    </React.Fragment>
  )
}

export default CustomersTable