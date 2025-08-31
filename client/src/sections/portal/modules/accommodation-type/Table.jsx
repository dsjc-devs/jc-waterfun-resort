import React, { useState } from 'react'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useGetAccommodationTypes } from 'api/accomodationsType';
import { useMemo } from 'react';

import ReusableTable from 'components/ReusableTable'
import { useNavigate } from 'react-router';
import IconButton from 'components/@extended/IconButton';
import AccommodationTypeDrawer from './Drawer';
import { RobotMower } from 'mdi-material-ui';
import { mutate } from 'swr';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { toast } from 'react-toastify';
import agent from 'api';
import { NO_CATEGORY } from 'constants/constants';

const AccommodationTypeTable = () => {
  const { accomodationTypes: _accomodationTypes, isLoading, mutate } = useGetAccommodationTypes()

  const accomodationTypes = _accomodationTypes
    ?.filter(item => item.title !== NO_CATEGORY)
    .concat(_accomodationTypes.filter(item => item.title === NO_CATEGORY));

  const [loading, setLoading] = useState(false)
  const [deleteConfigs, setDeleteConfigs] = useState({ data: {}, open: false })

  const navigate = useNavigate()

  const [openDrawerConfigs, setOpenDrawerConfigs] = useState({
    data: {},
    open: false
  })

  const columns = useMemo(
    () => [
      {
        id: 'title',
        align: 'left',
        disablePadding: true,
        label: 'Type',
        renderCell: (row) => (
          <Typography> {row.title} </Typography>
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
            <Tooltip title="View Accomodations">
              <Button
                variant='contained'
                startIcon={<EyeOutlined />}
                size='small'
                onClick={() => navigate(`/portal/accommodations?type=${row.slug}`)}
              >
                View
              </Button>
            </Tooltip>



            {row?.title !== NO_CATEGORY && (
              <React.Fragment>
                <Tooltip title="Edit this Accommodation Type">
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
                <Tooltip title="Delete this Accommodation Type">
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
    setLoading(true)
    try {
      await agent.AccommodationType.deleteAccommodationType(deleteConfigs.data?._id)
      toast.success("Accommodation type deleted.")
    } catch (error) {
      toast.error(error?.message || "Error Occured")
      console.error(error);
    } finally {
      setLoading(false)
      setDeleteConfigs({ data: {}, open: false })
      await mutate()
    }
  }

  return (
    <React.Fragment>
      <ReusableTable
        searchableColumns={['title']}
        itemsPerPage={1}
        columns={columns}
        rows={accomodationTypes || []}
        isLoading={isLoading}
        noMessage="No accommodation type found."
        settings={{
          order: "desc",
          orderBy: "desc",
          otherActionButton: (
            <Button
              variant='contained'
              sx={{ width: '150px' }}
              startIcon={<PlusOutlined />}
              onClick={() => setOpenDrawerConfigs({ data: {}, open: true })}
            >
              Add Type
            </Button>
          )
        }}
      />

      <AccommodationTypeDrawer
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
            <Typography>
              Any spaces under this type will be moved to <Box component='span' color='primary.main'>{NO_CATEGORY}</Box>.
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

export default AccommodationTypeTable