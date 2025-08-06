import React, { useMemo, useState } from 'react'
import { useGetUsers } from 'api/users'
import { useNavigate } from 'react-router'
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Box, Button, Chip, Fade, Menu, MenuItem, Stack, Typography } from '@mui/material'

import agent from 'api'
import Avatar from 'components/@extended/Avatar'
import IconButton from 'components/@extended/IconButton'
import ConvertDate from 'components/ConvertDate'
import useAuth from 'hooks/useAuth'
import ConfirmationDialog from 'components/ConfirmationDialog'
import Table from 'components/Table'
import RegistrationModal from 'components/RegistrationModal'
import { toast } from 'react-toastify'

const CustomersTable = ({ queryObj = {} }) => {
  const { data, isLoading, mutate } = useGetUsers({ queryObj });
  const { users } = data || {}

  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [deleteConfigs, setDeleteConfigs] = useState({
    open: false,
    userId: ''
  })

  const [openMenu, setOpenMenu] = useState({ anchorEl: null, userId: null });
  const [isOpenAddCustomer, setIsOpenAddCustomer] = useState(false)

  const handleMenuClick = (event, userId) => {
    setOpenMenu({ anchorEl: event.currentTarget, userId });
  };

  const handleMenuClose = () => {
    setOpenMenu({ anchorEl: null, userId: null });
  };

  const handleDelete = async () => {
    setLoading(true)
    try {
      await agent.Users.deleteUser(deleteConfigs.userId)
      toast.success("Deleted successfully.", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 3000,
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
            <Typography
              variant='subtitle2'
              color="secondary.600"
            >
              #{row.userId}
            </Typography>
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
        const { position, userId } = row || {}
        const _position = position[0]?.value
        const isSameRole = user?.position[0]?.value === _position

        return (
          <IconButton
            aria-label="more"
            aria-controls={openMenu.userId === userId ? 'row-menu' : undefined}
            aria-haspopup="true"
            onClick={(e) => handleMenuClick(e, userId)}
          >
            <EllipsisOutlined />
          </IconButton>
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
          otherActionButton: (
            <Button
              variant='contained'
              startIcon={<PlusOutlined />}
              onClick={() => setIsOpenAddCustomer(prevState => !prevState)}
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

      <Menu
        id={`row-menu-${openMenu.userId}`}
        anchorEl={openMenu.anchorEl}
        open={Boolean(openMenu.anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            navigate(`/portal/customers/details/${openMenu.userId}`)
            handleMenuClose()
          }}
        >
          <EyeOutlined style={{ marginRight: 8 }} />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            setDeleteConfigs({ open: true, userId: openMenu.userId })
            handleMenuClose()
          }}
        >
          <DeleteOutlined style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      <RegistrationModal
        handleClose={() => setIsOpenAddCustomer(prevState => !prevState)}
        open={isOpenAddCustomer}
        title='Create Customer'
      />
    </React.Fragment>
  )
}

export default CustomersTable