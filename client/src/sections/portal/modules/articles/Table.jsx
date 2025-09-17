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
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  Fade,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGetMarketingMaterials } from 'api/marketing-materials';

import ReusableTable from 'components/ReusableTable';
import ConvertDate from 'components/ConvertDate';
import Avatar from 'components/@extended/Avatar';
import ConfirmationDialog from 'components/ConfirmationDialog';
import agent from 'api';
import ArticleList from 'sections/dynamic-pages/ArticleList';

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

const MarketingMaterialsTable = ({ queryObj = {} }) => {
  const navigate = useNavigate();
  const { data, isLoading, mutate } = useGetMarketingMaterials(queryObj);
  const marketingMaterials = data?.marketingMaterials || [];

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openMenu, setOpenMenu] = useState({ anchorEl: null, materialId: '' });
  const [viewMode, setViewMode] = useState('list');

  const handleMenuClose = () => setOpenMenu({ anchorEl: null, materialId: '' });

  const handleDelete = async () => {
    try {
      await agent.deleteMarketingMaterial(deleteTarget._id);
      toast.success('Article deleted');
      await mutate();
    } catch (error) {
      toast.error('Failed to delete Article');
    } finally {
      handleMenuClose();
      setDeleteTarget(null);
    }
  };

  const handleMenuClick = (event, materialId) => {
    setOpenMenu({ anchorEl: event.currentTarget, materialId });
  };

  const columns = useMemo(() => [
    {
      id: 'articleId',
      align: 'left',
      disablePadding: true,
      label: 'Article',
      renderCell: (row) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box>
            <Avatar variant="rectangle" size="lg" src={row.thumbnail} />
          </Box>
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
          size="small"
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
          <IconButton onClick={(e) => handleMenuClick(e, row._id)}>
            <EllipsisOutlined />
          </IconButton>
        </Tooltip>
      )
    }
  ], []);

  const actionButtons = (
    <React.Fragment>
      <Button
        variant="contained"
        startIcon={<PlusOutlined />}
        onClick={() => navigate('/portal/content-management/articles/form')}
        sx={{ mr: 1 }}
      >
        Add Article
      </Button>
      <Button
        variant="outlined"
        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        startIcon={viewMode === 'list' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
      >
        {viewMode === 'list' ? 'Grid View' : 'List View'}
      </Button>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {viewMode === 'grid' ? (
        <React.Fragment>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {actionButtons}
          </Box>
          <ArticleList
            articles={marketingMaterials}
            isOnPortal={true}
            onEdit={(material) => navigate(`/portal/content-management/articles/form?id=${material._id}`)}
            onDelete={(material) => setDeleteTarget(material)}
          />
        </React.Fragment>
      ) : (
        <ReusableTable
          searchableColumns={['marketingId', 'title', 'status']}
          itemsPerPage={6}
          columns={columns}
          rows={marketingMaterials}
          isLoading={isLoading}
          noMessage="No marketing materials found."
          settings={{ otherActionButton: actionButtons }}
        />
      )}

      <Menu
        anchorEl={openMenu.anchorEl}
        open={Boolean(openMenu.anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            navigate(`/portal/content-management/articles/details/${openMenu.materialId}`);
            handleMenuClose();
          }}
        >
          <EyeOutlined style={{ marginRight: 8 }} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate(`/portal/content-management/articles/form?id=${openMenu.materialId}`);
            handleMenuClose();
          }}
        >
          <EditOutlined style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            const material = marketingMaterials.find(m => m._id === openMenu.materialId);
            setDeleteTarget(material);
            handleMenuClose();
          }}
        >
          <DeleteOutlined style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        title="Delete Marketing Material"
        description={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        handleConfirm={handleDelete}
        open={Boolean(deleteTarget)}
        handleClose={() => setDeleteTarget(null)}
      />
    </React.Fragment>
  );
};

export default MarketingMaterialsTable;
