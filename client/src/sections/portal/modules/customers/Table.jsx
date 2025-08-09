import React, { useMemo, useState } from 'react';
import { useGetUsers } from 'api/users';
import { useNavigate } from 'react-router';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  Box,
  Button,
  Chip,
  Fade,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';

import agent from 'api';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import ConvertDate from 'components/ConvertDate';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Table from 'components/Table';
import RegistrationModal from 'components/RegistrationModal';
import { toast } from 'react-toastify';
import UserEditModal from './UserEditModal';
import { USER_ROLES } from 'constants/constants';
import useAuth from 'hooks/useAuth';

const CustomersTable = ({ queryObj = {} }) => {
  const { user } = useAuth()

  const { data, isLoading, mutate } = useGetUsers({ queryObj });
  const { users: customers } = data || {};

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState({
    addCustomer: false,
    editUser: null,
    deleteUserId: null,
  });

  const [menuState, setMenuState] = useState({
    anchorEl: null,
    userId: null
  });

  const handleMenuClick = (event, userId) => {
    setMenuState({ anchorEl: event.currentTarget, userId });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, userId: null });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await agent.Users.deleteUser(modalState.deleteUserId);
      toast.success('Deleted successfully.', { autoClose: 3000 });
      await mutate();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete user', { autoClose: 3000 });
    } finally {
      setLoading(false);
      setModalState((prev) => ({ ...prev, deleteUserId: null }));
    }
  };

  const handleEditSave = async (values) => {
    if (!modalState.editUser) return;
    setLoading(true);
    try {
      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        if (key === 'avatar') {
          if (typeof values[key] === 'string') {
            formData.append('avatar', values[key]);
          } else if (values[key] && values[key].length > 0) {
            formData.append('avatar', values[key][0]);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      await agent.Users.editUser(modalState.editUser.userId, formData);
      toast.success('User updated successfully');
      await mutate();
      setModalState((prev) => ({ ...prev, editUser: null }));
    } catch (error) {
      toast.error(error?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const isMasterAdmin = user?.position[0].value === USER_ROLES.MASTER_ADMIN.value
  const isAdmin = user?.position[0].value === USER_ROLES.ADMIN.value

  const columns = useMemo(
    () => [
      {
        id: 'userId',
        align: 'left',
        disablePadding: true,
        label: 'Name',
        renderCell: (row) => (
          <Stack flexDirection="row" gap={2} alignItems="center">
            <Avatar size="lg" src={row?.avatar} />
            <Box>
              <Typography variant="subtitle2" color="secondary.600">
                #{row.userId}
              </Typography>
              <Typography variant="subtitle1">
                {row.firstName} {row.lastName}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                {row.emailAddress}
              </Typography>
            </Box>
          </Stack>
        )
      },
      {
        id: 'status',
        align: 'center',
        disablePadding: true,
        label: 'Status',
        sortValue: (row) =>
        ({
          BANNED: 4,
          ARCHIVED: 3,
          ACTIVE: 2,
          INACTIVE: 1
        }[row?.status] || 0),
        renderCell: (row) => {
          const { status } = row || {};
          return (
            <Chip
              sx={{ width: '150px' }}
              label={
                <Typography variant="subtitle1">
                  {{
                    ACTIVE: 'Active',
                    INACTIVE: 'Inactive',
                    ARCHIVED: 'Archived',
                    BANNED: 'Banned'
                  }[status]}
                </Typography>
              }
              color={
                {
                  ACTIVE: 'primary',
                  INACTIVE: 'error',
                  ARCHIVED: 'info',
                  BANNED: 'warning'
                }[status] || 'default'
              }
            />
          );
        }
      },
      {
        id: 'createdAt',
        align: 'left',
        disablePadding: true,
        label: 'Date Created',
        renderCell: (row) => <ConvertDate dateString={row.createdAt} />
      },
      {
        id: 'actions',
        align: 'center',
        label: '',
        renderCell: (row) => (
          <IconButton
            aria-label="more"
            aria-controls={
              menuState.userId === row.userId ? 'row-menu' : undefined
            }
            aria-haspopup="true"
            onClick={(e) => handleMenuClick(e, row.userId)}
          >
            <EllipsisOutlined />
          </IconButton>
        )
      }
    ],
    [customers, menuState.userId]
  );

  return (
    <>
      <Table
        searchableColumns={['emailAddress', 'firstName', 'lastName', 'userId']}
        itemsPerPage={1}
        columns={columns}
        rows={customers || []}
        noMessage="No customers found."
        isLoading={isLoading || loading}
        settings={{
          otherActionButton: (
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() =>
                setModalState((prev) => ({
                  ...prev,
                  addCustomer: true
                }))
              }
              sx={{ width: '150px' }}
            >
              Add Customer
            </Button>
          )
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmationDialog
        title="Delete User"
        description="Are you sure you want to delete this user?"
        handleConfirm={handleDelete}
        open={Boolean(modalState.deleteUserId)}
        handleClose={() =>
          setModalState((prev) => ({ ...prev, deleteUserId: null }))
        }
      />

      {/* Row Actions Menu */}
      <Menu
        id={`row-menu-${menuState.userId}`}
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            navigate(`/portal/customers/details/${menuState.userId}`);
            handleMenuClose();
          }}
        >
          <EyeOutlined style={{ marginRight: 8 }} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            const user = customers.find((c) => c.userId === menuState.userId);
            setModalState((prev) => ({ ...prev, editUser: user }));
            handleMenuClose();
          }}
        >
          <EditOutlined style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setModalState((prev) => ({
              ...prev,
              deleteUserId: menuState.userId
            }));
            handleMenuClose();
          }}
        >
          <DeleteOutlined style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      <RegistrationModal
        handleClose={() =>
          setModalState((prev) => ({ ...prev, addCustomer: false }))
        }
        open={modalState.addCustomer}
        title="Create Customer"
      />

      <UserEditModal
        formData={modalState.editUser || {}}
        onClose={() => setModalState((prev) => ({ ...prev, editUser: null }))}
        onSave={handleEditSave}
        open={Boolean(modalState.editUser)}
        isSaving={loading}
      />
    </>
  );
};

export default CustomersTable;
