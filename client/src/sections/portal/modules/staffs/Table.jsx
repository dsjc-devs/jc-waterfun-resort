import React, { useMemo, useState } from 'react'
import { Box, Button, Chip, Fade, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material'
import { useGetUsers } from 'api/users'
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { USER_ROLES } from 'constants/constants'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

import agent from 'api'
import Avatar from 'components/@extended/Avatar'
import IconButton from 'components/@extended/IconButton'
import ConvertDate from 'components/ConvertDate'
import useAuth from 'hooks/useAuth'
import StaffDetails from './Details'
import ConfirmationDialog from 'components/ConfirmationDialog'
import Table from 'components/Table'
import RegistrationModal from 'components/RegistrationModal'


const UsersTable = ({ queryObj = {} }) => {
  const { data, isLoading, mutate } = useGetUsers({ queryObj });
  const { users } = data || {}

  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [deleteConfigs, setDeleteConfigs] = useState({
    open: false,
    userId: ''
  })
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false)
  const [openMenu, setOpenMenu] = useState({ anchorEl: null, userId: null });

  const handleMenuClick = (event, userId) => {
    setOpenMenu({ anchorEl: event.currentTarget, userId });
  };

  const handleMenuClose = () => {
    setOpenMenu({ anchorEl: null, userId: null });
  };

  const isMasterAdmin = user?.position[0].value === USER_ROLES.MASTER_ADMIN.value
  const isAdmin = user?.position[0].value === USER_ROLES.ADMIN.value

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
      id: 'position',
      align: 'center',
      disablePadding: true,
      label: 'Position',
      sortValue: (row) => {
        const _position = row?.position?.[0]?.value || '';
        return {
          MASTER_ADMIN: 3,
          ADMIN: 2,
          RECEPTIONIST: 1
        }[_position] || 0;
      },
      renderCell: (row) => {
        const { position } = row || {};
        const _position = position[0]?.value;

        return (
          <Chip
            sx={{ width: "150px" }}
            variant='light'
            label={<Typography variant='subtitle1'>
              {{
                MASTER_ADMIN: USER_ROLES.MASTER_ADMIN.label,
                ADMIN: USER_ROLES.ADMIN.label,
                RECEPTIONIST: USER_ROLES.RECEPTIONIST.label
              }[_position]}
            </Typography>}
            color={{
              MASTER_ADMIN: 'primary',
              RECEPTIONIST: 'success',
              ADMIN: 'info',
            }[_position] || 'default'}
          />
        );
      }
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: true,
      label: 'Status',
      sortValue: (row) => {
        const status = row?.status || '';
        return {
          BANNED: 4,
          ARCHIVED: 3,
          ACTIVE: 2,
          INACTIVE: 1
        }[status] || 0;
      },
      renderCell: (row) => {
        const { status } = row || {};

        return (
          <Chip
            sx={{ width: "150px" }}
            label={<Typography variant='subtitle1'>
              {{
                ACTIVE: 'Active',
                INACTIVE: 'Inactive',
                ARCHIVED: 'Archived',
                BANNED: 'Banned',
              }[status]}
            </Typography>}
            color={{
              ACTIVE: 'primary',
              INACTIVE: 'error',
              ARCHIVED: 'info',
              BANNED: 'warning',
            }[status] || 'default'}
          />
        );
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
      label: '',
      renderCell: (row) => {
        const { userId } = row || {}

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
        noMessage='No staffs found.'
        settings={{
          otherActionButton: (
            (isMasterAdmin || isAdmin) && <Button
              variant='contained'
              startIcon={<PlusOutlined />}
              onClick={() => setIsOpenAddDialog((prevState) => !prevState)}
              sx={{ width: '150px' }}
            >
              Add Staff
            </Button>
          )
        }}
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
            navigate(`/portal/staffs?userId=${openMenu.userId}`)
            handleMenuClose()
          }}
        >
          <EyeOutlined style={{ marginRight: 8 }} />
          View
        </MenuItem>

        {(isMasterAdmin || isAdmin) && user && openMenu.userId && (() => {
          const targetUser = users?.find((u) => u.userId === openMenu.userId);
          const targetRole = targetUser?.position?.[0]?.value;
          const currentRole = user?.position?.[0]?.value;

          const isSameUser = user?.userId === targetUser?.userId;
          const isSameRole = targetRole === currentRole;
          const isTargetMasterAdmin = targetRole === "MASTER_ADMIN";

          const canEdit = isSameUser || (!isSameRole && !isTargetMasterAdmin);
          const canDelete = !isSameUser && !isSameRole && !isTargetMasterAdmin;

          return (
            <>
              <Tooltip title={canEdit ? "" : "Not authorized to edit this user"} arrow>
                <span>
                  <MenuItem
                    onClick={() => {
                      if (canEdit) {
                        navigate(`/portal/staffs?userId=${openMenu.userId}&isEditMode=true`)
                        handleMenuClose()
                      }
                    }}
                    disabled={!canEdit}
                  >
                    <EditOutlined style={{ marginRight: 8 }} />
                    Edit
                  </MenuItem>
                </span>
              </Tooltip>

              <Tooltip title={canDelete ? "" : "Not authorized to delete this user"} arrow>
                <span>
                  <MenuItem
                    onClick={() => {
                      if (canDelete) {
                        setDeleteConfigs({ open: true, userId: openMenu.userId });
                      }
                      handleMenuClose();
                    }}
                    disabled={!canDelete}
                  >
                    <DeleteOutlined style={{ marginRight: 8 }} />
                    Delete
                  </MenuItem>
                </span>
              </Tooltip>
            </>
          );
        })()}
      </Menu>

      <StaffDetails mutate={mutate} />

      <ConfirmationDialog
        title='Delete User'
        description='Are you sure you want to delete this user?'
        handleConfirm={handleDelete}
        open={deleteConfigs.open}
        handleClose={() => setDeleteConfigs({ ...deleteConfigs, open: false })}
      />

      <RegistrationModal
        open={isOpenAddDialog}
        handleClose={() => setIsOpenAddDialog((prevState) => !prevState)}
        type='RECEPTIONIST'
        title='Create Staff'
      />
    </React.Fragment>
  )
}

export default UsersTable