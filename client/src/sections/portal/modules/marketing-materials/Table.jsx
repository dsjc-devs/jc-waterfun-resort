import React, { useMemo, useState } from 'react';
import {
  AppstoreOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import {
  Box,
  Button,
  Chip,
  Dialog,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  Fade
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import ReusableTable from 'components/ReusableTable';
import ConvertDate from 'components/ConvertDate';
import Avatar from 'components/@extended/Avatar';
import ConfirmationDialog from 'components/ConfirmationDialog';
import MarketingMaterialForm from 'sections/portal/modules/marketing-materials/Form';
import agent from 'api';
import { useGetMarketingMaterials } from 'api/marketing-materials';

const statusLabels = {
  POSTED: 'Posted',
  UNPUBLISHED: 'Unpublished',
  ARCHIVED: 'Archived'
};

const statusColors = {
  POSTED: 'primary',
  UNPUBLISHED: 'warning',
  ARCHIVED: 'error'
};

const GridCard = ({ material, navigate }) => (
  <Box
    sx={{
      bgcolor: 'background.paper',
      boxShadow: 1,
      borderRadius: 2,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
  >
    <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%', overflow: 'hidden' }}>
      <Avatar
        variant="rectangle"
        src={material.thumbnail}
        alt={material.title}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          bgcolor: 'rgba(0,0,0,0.6)',
          color: '#fff',
          px: 1,
          py: 0.3,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 'medium',
          userSelect: 'none'
        }}
      >
        <ConvertDate dateString={material.createdAt} />
      </Box>
    </Box>

    <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {material.title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flexGrow: 1, mb: 2, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {material.subtitle || material.description || 'No description available.'}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Typography
          component="a"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() =>
            navigate(`/portal/content-management/marketing-materials/details/${material._id}`)
          }
        >
          View Article
        </Typography>
      </Stack>
    </Box>
  </Box>
);

const MarketingMaterialsTable = ({ queryObj = {} }) => {
  const navigate = useNavigate();
  const { data, isLoading, mutate } = useGetMarketingMaterials(queryObj);
  const marketingMaterials = data?.marketingMaterials || [];
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openMenu, setOpenMenu] = useState({ anchorEl: null, material: null });
  const [viewMode, setViewMode] = useState('list');
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    editingMarketingMaterial: null
  });

  const [deleteConfigs, setDeleteConfigs] = useState({
    open: false,
    materialId: ''
  });

  const handleMenuClose = () => {
    setOpenMenu({ anchorEl: null, material: null });
  };

  const handleMenuClick = (event, material) => {
    setOpenMenu({ anchorEl: event.currentTarget, material });
  };

  const openAddModal = () => {
    setModalState({ open: true, editingMarketingMaterial: null });
  };

  const openEditModal = (marketingMaterial) => {
    setModalState({ open: true, editingMarketingMaterial: marketingMaterial });
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget) {
        await agent.MarketingMaterials.deleteMarketingMaterial(deleteTarget._id);
        toast.success('Marketing Material deleted');
        await mutate();
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete Marketing Material');
    } finally {
      setOpenMenu({ anchorEl: null, material: null });
      setDeleteConfigs({ open: false, materialId: '' });
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("thumbnail", values.thumbnail);
      formData.append("status", values.status);
      formData.append("content", values.content);

      if (values.existingAttachments && values.existingAttachments.length > 0) {
        formData.append("existingAttachments", JSON.stringify(values.existingAttachments));
      } else {
        formData.append("existingAttachments", JSON.stringify([]));
      }

      if (values.attachmentsToRemove && values.attachmentsToRemove.length > 0) {
        formData.append("attachmentsToRemove", JSON.stringify(values.attachmentsToRemove));
      }

      if (values.files && values.files.length > 0) {
        values.files.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      if (modalState.editingMarketingMaterial) {
        await agent.MarketingMaterials.editMarketingMaterial(
          modalState.editingMarketingMaterial._id,
          formData
        );
        toast.success("Marketing Material updated");
      } else {
        await agent.MarketingMaterials.addMarketingMaterial(formData);
        toast.success("Marketing Material created");
      }

      await mutate();
      setModalState({ open: false, editingMarketingMaterial: null });
      resetForm();
    } catch (error) {
      toast.error("Error: " + (error.message || "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'marketingId',
        align: 'left',
        label: 'Material',
        renderCell: (row) => (
          <Stack flexDirection="row" gap={2} alignItems="center">
            <Avatar variant="rectangle" src={row.thumbnail} />
            <Box>
              <Typography variant="subtitle2" color="secondary">
                #{row._id}
              </Typography>
              <Typography variant="subtitle1">{row.title}</Typography>
            </Box>
          </Stack>
        )
      },
      {
        id: 'views',
        align: 'center',
        label: 'Views',
        renderCell: (row) => <Typography variant="body1">{row.views}</Typography>
      },
      {
        id: 'status',
        align: 'center',
        label: 'Status',
        renderCell: (row) => (
          <Chip
            sx={{ width: '150px' }}
            label={statusLabels[row.status]}
            color={statusColors[row.status] || 'default'}
          />
        )
      },
      {
        id: 'createdAt',
        align: 'left',
        label: 'Date Created',
        renderCell: (row) => <ConvertDate dateString={row.createdAt} />
      },
      {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: '',
        renderCell: (row) => (
          <Tooltip title="Actions">
            <IconButton aria-label="more" onClick={(e) => handleMenuClick(e, row)}>
              <EllipsisOutlined />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    []
  );

  const otherActionButtons = (
    <>
      <Button
        variant="contained"
        startIcon={<PlusOutlined />}
        onClick={openAddModal}
        sx={{ width: '210px', mr: 1 }}
      >
        Add Marketing Material
      </Button>
      <Button
        variant="outlined"
        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        sx={{ width: '150px' }}
        startIcon={viewMode === 'list' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
      >
        {viewMode === 'list' ? 'Grid View' : 'List View'}
      </Button>
    </>
  );

  if (viewMode === 'grid') {
    return (
      <>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          {otherActionButtons}
        </Box>

        <Grid container spacing={2}>
          {marketingMaterials.length > 0 ? (
            marketingMaterials.map((material) => (
              <Grid key={material._id} item xs={12} sm={6} md={4}>
                <GridCard material={material} navigate={navigate} />
              </Grid>
            ))
          ) : (
            <Typography sx={{ m: 2 }}>No marketing materials found.</Typography>
          )}
        </Grid>

        <Dialog
          open={modalState.open}
          onClose={() => setModalState({ open: false, editingMarketingMaterial: null })}
          fullWidth
          maxWidth="lg"
        >
          <MarketingMaterialForm
            initialValues={{
              title: modalState.editingMarketingMaterial?.title || '',
              thumbnail: modalState.editingMarketingMaterial?.thumbnail || '',
              status: modalState.editingMarketingMaterial?.status || 'POSTED',
              existingAttachments: modalState.editingMarketingMaterial?.attachments || [],
              files: [],
              content: modalState.editingMarketingMaterial?.content || ''
            }}
            editingMarketingMaterial={modalState.editingMarketingMaterial}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalState({ open: false, editingMarketingMaterial: null })}
            loading={loading}
            data={data}
          />
        </Dialog>

      </>
    );
  }

  return (
    <>
      <ReusableTable
        searchableColumns={['marketingId', 'title', 'status']}
        itemsPerPage={6}
        columns={columns}
        rows={marketingMaterials}
        isLoading={isLoading || loading}
        noMessage="No marketing materials found."
        settings={{ otherActionButton: otherActionButtons }}
      />

      <Dialog
        open={modalState.open}
        onClose={() => setModalState({ open: false, editingMarketingMaterial: null })}
        fullWidth
        maxWidth="lg"
      >
        <MarketingMaterialForm
          initialValues={{
            title: modalState.editingMarketingMaterial?.title || '',
            thumbnail: modalState.editingMarketingMaterial?.thumbnail || '',
            status: modalState.editingMarketingMaterial?.status || 'POSTED',
            existingAttachments: modalState.editingMarketingMaterial?.attachments || [],
            files: [],
            content: modalState.editingMarketingMaterial?.content || ''
          }}
          editingMarketingMaterial={modalState.editingMarketingMaterial}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState({ open: false, editingMarketingMaterial: null })}
          loading={loading}
          data={data}
        />
      </Dialog>

      <Menu
        id={`row-menu-${openMenu.material?._id}`}
        anchorEl={openMenu.anchorEl}
        open={Boolean(openMenu.anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() =>
            navigate(`/portal/content-management/marketing-materials/details/${openMenu.material?._id}`)
          }
        >
          <Tooltip title="View">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EyeOutlined />
              View
            </Box>
          </Tooltip>
        </MenuItem>
        <MenuItem onClick={() => openEditModal(openMenu.material)}>
          <Tooltip title="Edit">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditOutlined />
              Edit
            </Box>
          </Tooltip>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteConfigs({ open: true, materialId: openMenu.material?._id });
            setDeleteTarget(openMenu.material);
            handleMenuClose();
          }}
        >
          <Tooltip title="Delete">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DeleteOutlined />
              Delete
            </Box>
          </Tooltip>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        title="Delete Marketing Material"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        handleConfirm={handleDelete}
        open={deleteConfigs.open}
        handleClose={() => {
          setDeleteConfigs({ open: false, materialId: '' });
          setDeleteTarget(null);
        }}
      />
    </>
  );
};

export default MarketingMaterialsTable;
