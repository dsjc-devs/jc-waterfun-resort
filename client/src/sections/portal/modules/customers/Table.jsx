import React, { useMemo, useState } from 'react';
import { useGetUsers } from 'api/users';
import { useNavigate } from 'react-router';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import {
  Box,
  Button,
  Chip,
  Fade,
  Grid,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Typography,
  Tooltip
} from '@mui/material';

import agent from 'api';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import ConvertDate from 'components/ConvertDate';
import ConfirmationDialog from 'components/ConfirmationDialog';
import ReusableTable from 'components/ReusableTable';
import RegistrationModal from 'components/RegistrationModal';
import SimpleUserCard from 'components/SimpleUserCard';
import { toast } from 'react-toastify';
import UserEditModal from './UserEditModal';
import { USER_ROLES } from 'constants/constants';
import useAuth from 'hooks/useAuth';
import MainCard from 'components/MainCard';

const CustomersTable = ({ queryObj = {} }) => {
  const { user: currentUser } = useAuth();
  const { data, isLoading, mutate } = useGetUsers({ queryObj });
  const { users: customers } = data || {};

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    addCustomer: false,
    editUser: null,
    deleteUserId: null
  });
  const [menuState, setMenuState] = useState({
    anchorEl: null,
    userId: null
  });

  const [viewMode, setViewMode] = useState('list');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const handleMenuClick = (event, userId) => {
    setMenuState({ anchorEl: event.currentTarget, userId });
  };

  const handleMenuClose = () => {
    setMenuState({ anchorEl: null, userId: null });
  };

  const isMasterAdmin = currentUser?.position?.[0]?.value === USER_ROLES.MASTER_ADMIN.value;
  const isAdmin = currentUser?.position?.[0]?.value === USER_ROLES.ADMIN.value;

  const canEditOrDelete = (targetUser) => {
    if (!currentUser) return { canEdit: false, canDelete: false };
    const targetRole = targetUser?.position?.[0]?.value;
    const currentRole = currentUser?.position?.[0]?.value;
    const isSameUser = currentUser?.userId === targetUser?.userId;
    const isSameRole = targetRole === currentRole;
    const isTargetMasterAdmin = targetRole === USER_ROLES.MASTER_ADMIN.value;

    return {
      canEdit: isSameUser || (!isSameRole && !isTargetMasterAdmin && (isMasterAdmin || isAdmin)),
      canDelete: !isSameUser && !isSameRole && !isTargetMasterAdmin && (isMasterAdmin || isAdmin)
    };
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
      const formData = new FormData();
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
            aria-controls={menuState.userId === row.userId ? 'row-menu' : undefined}
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

  const paginatedCustomers = useMemo(() => {
    if (!customers) return [];
    const startIndex = (page - 1) * itemsPerPage;
    return customers.slice(startIndex, startIndex + itemsPerPage);
  }, [customers, page]);

  const otherActionButtons = (isMasterAdmin || isAdmin) && (
    <React.Fragment>
      <Button
        variant="contained"
        startIcon={<PlusOutlined />}
        onClick={() => setModalState((prev) => ({ ...prev, addCustomer: true }))}
        sx={{ width: '150px', mr: 1 }}
      >
        Add Customer
      </Button>

      <Button
        variant="outlined"
        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        sx={{ width: '150px' }}
        startIcon={viewMode === 'list' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
      >
        {viewMode === 'list' ? 'Grid View' : 'List View'}
      </Button>
    </React.Fragment >
  )

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      {viewMode === 'list' && (
        <ReusableTable
          searchableColumns={['emailAddress', 'firstName', 'lastName', 'userId']}
          itemsPerPage={1}
          columns={columns}
          rows={customers || []}
          isLoading={isLoading || loading}
          noMessage="No customers found."
          settings={{
            otherActionButton: otherActionButtons
          }}
        />
      )}

      {viewMode === 'grid' && (
        <React.Fragment>
          <Box padding={2} display="flex" justifyContent="flex-end" mb={1}>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => setModalState((prev) => ({ ...prev, addCustomer: true }))}
              sx={{ width: '150px', mr: 1 }}
            >
              Add Customer
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<UnorderedListOutlined />}
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
          </Box>
          <MainCard>
            <Grid container spacing={2}>
              {paginatedCustomers.map((cust) => {
                const { canEdit, canDelete } = canEditOrDelete(cust);
                return (
                  <Grid item key={cust.userId} xs={12} md={4}>
                    <SimpleUserCard
                      user={cust}
                      currentUser={currentUser}
                      onView={(u) => navigate(`/portal/customers/details/${u.userId}`)}
                      onEdit={canEdit ? (u) => setModalState((prev) => ({ ...prev, editUser: u })) : undefined}
                      onDelete={canDelete ? (u) => setModalState((prev) => ({ ...prev, deleteUserId: u.userId })) : undefined}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </MainCard>
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={Math.ceil((customers?.length || 0) / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="small"
              shape="rounded"
            />
          </Box>
        </React.Fragment>
      )}

      <ConfirmationDialog
        title="Delete User"
        description="Are you sure you want to delete this user?"
        handleConfirm={handleDelete}
        open={Boolean(modalState.deleteUserId)}
        handleClose={() => setModalState((prev) => ({ ...prev, deleteUserId: null }))}
      />

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

        {(() => {
          const targetUser = customers?.find((c) => c.userId === menuState.userId);
          if (!targetUser) return null;
          const { canEdit, canDelete } = canEditOrDelete(targetUser);

          return (
            <>
              <Tooltip title={canEdit ? '' : 'Not authorized to edit this user'} arrow>
                <span>
                  <MenuItem
                    onClick={() => {
                      if (canEdit) setModalState((prev) => ({ ...prev, editUser: targetUser }));
                      handleMenuClose();
                    }}
                    disabled={!canEdit}
                  >
                    <EditOutlined style={{ marginRight: 8 }} />
                    Edit
                  </MenuItem>
                </span>
              </Tooltip>

              <Tooltip title={canDelete ? '' : 'Not authorized to delete this user'} arrow>
                <span>
                  <MenuItem
                    onClick={() => {
                      if (canDelete) setModalState((prev) => ({ ...prev, deleteUserId: menuState.userId }));
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

      <RegistrationModal
        handleClose={() => setModalState((prev) => ({ ...prev, addCustomer: false }))}
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
