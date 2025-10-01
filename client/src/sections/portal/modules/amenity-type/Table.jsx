import React, { useState, useMemo } from 'react'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useGetAmenityTypes } from 'api/amenity-type';
import ReusableTable from 'components/ReusableTable'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { NO_CATEGORY } from 'constants/constants';

import agent from 'api';
import AmenityTypeDrawer from './Drawer';
import ConfirmationDialog from 'components/ConfirmationDialog';

const AmenityTypeTable = () => {
  const { amenityTypes: _amenityTypes, isLoading, mutate } = useGetAmenityTypes();

  const amenityTypes = _amenityTypes || [];

  const [loading, setLoading] = useState(false);
  const [deleteConfigs, setDeleteConfigs] = useState({ data: {}, open: false });
  const [openDrawerConfigs, setOpenDrawerConfigs] = useState({
    data: {},
    open: false
  });

  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        id: 'title',
        align: 'left',
        disablePadding: true,
        label: 'Amenity',
        renderCell: (row) => (
          <Typography> {row.name} </Typography>
        )
      },
      {
        id: 'count',
        align: 'center',
        disablePadding: true,
        label: 'Total Units',
        renderCell: (row) => (
          <Chip
            label={row.count}
            variant='light'
            color='primary'
            sx={{ width: '50px' }}
            size='small'
          />
        )
      },
      {
        id: 'actions',
        align: 'right',
        disablePadding: true,
        label: '',
        renderCell: (row) => (
          <Stack direction='row' spacing={2} justifyContent='flex-end' >
            <Tooltip title="View Amenities">
              <Button
                variant='contained'
                startIcon={<EyeOutlined />}
                size='small'
                onClick={() => navigate(`/portal/amenities?type=${row.slug}`)}
              >
                View
              </Button>
            </Tooltip>

            {(row.name !== NO_CATEGORY) && (
              <React.Fragment>
                <Tooltip title="Edit this Amenity Type">
                  <Button
                    variant='contained'
                    startIcon={<EditOutlined />}
                    size='small'
                    color="info"
                    onClick={() => setOpenDrawerConfigs({ data: row, open: true })}
                  >
                    Edit
                  </Button>
                </Tooltip>

                <Tooltip title="Delete this Amenity Type">
                  <Button
                    variant='contained'
                    startIcon={<DeleteOutlined />}
                    size='small'
                    color="error"
                    onClick={() => setDeleteConfigs({ data: row, open: true })}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </React.Fragment>
            )}
          </Stack>
        )
      },
    ],
    []
  );

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await agent.AmenityType.deleteAmenityType(deleteConfigs.data?._id);
      toast.success("Amenity type deleted.");
    } catch (error) {
      toast.error(error?.message || "Error Occurred");
      console.error(error);
    } finally {
      setLoading(false);
      setDeleteConfigs({ data: {}, open: false });
      await mutate();
    }
  };

  return (
    <React.Fragment>
      <ReusableTable
        searchableColumns={['name']}
        itemsPerPage={1}
        columns={columns}
        rows={amenityTypes}
        isLoading={isLoading}
        noMessage="No amenity type found."
        settings={{
          order: "desc",
          orderBy: "desc",
          otherActionButton: (
            <Button
              variant='contained'
              startIcon={<PlusOutlined />}
              onClick={() => setOpenDrawerConfigs({ data: {}, open: true })}
            >
              Add Amenity Type
            </Button>
          )
        }}
      />

      <AmenityTypeDrawer
        open={openDrawerConfigs.open}
        handleClose={() => setOpenDrawerConfigs({ data: {}, open: false })}
        typeData={openDrawerConfigs.data}
        mutate={mutate}
      />

      <ConfirmationDialog
        title={`Delete "${deleteConfigs.data.title}"`}
        sx={{ width: 500 }}
        description={
          <Box>
            <Typography>
              Are you sure you want to delete <Box component='span' color='error.main'>{deleteConfigs.data.title}</Box>?
            </Typography>
          </Box>
        }
        handleConfirm={handleDeleteConfirm}
        open={deleteConfigs.open}
        handleClose={() => setDeleteConfigs({ data: {}, open: false })}
        loading={loading}
      />
    </React.Fragment>
  )
}

export default AmenityTypeTable