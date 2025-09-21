import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Drawer, Stack, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import agent from 'api';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import ConfirmationDialog from 'components/ConfirmationDialog';

const AmenityTypeDrawer = ({ open, handleClose, mutate, typeData }) => {
  const [formData, setFormData] = useState({ name: '' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!typeData?._id;

  const previousName = typeData?.name || '';
  const currentName = formData?.name;

  useEffect(() => {
    if (typeData) {
      setFormData({ name: typeData?.name || '' });
    } else {
      setFormData({ name: '' });
    }
  }, [typeData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        setOpenConfirmDialog(true);
      } else {
        setLoading(true);
        await agent.AmenityType.addAmenityType(formData);
        toast.success(`${currentName} has been successfully added.`);
        handleClose();
      }
    } catch (error) {
      toast.error(error?.message || "Error Occurred");
      console.error(error);
    } finally {
      setLoading(false);
      await mutate();
    }
  };

  const handleEditConfirm = async () => {
    setLoading(true);
    try {
      await agent.AmenityType.editAmenityType(typeData?._id, formData);
      await mutate();
      setOpenConfirmDialog(false);
    } catch (error) {
      toast.error(error?.message || "Error Occurred");
      console.error(error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleClose}
      >
        <Box sx={{ width: { xs: 300, md: 500 }, position: 'relative', height: '100%' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h2">{isEditMode ? `Edit ${previousName}` : 'Create New Amenity Type'}</Typography>
            <Typography variant="body1" color="secondary" gutterBottom>
              {isEditMode ? 'Edit existing amenity type' : 'Add a new amenity type'}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 2, pt: 3 }}>
            <Typography>Name (Required)</Typography>
            <TextField
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g Pool, Wifi, Parking"
              fullWidth
            />
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent='flex-end'
            p={2}
          >
            <Button onClick={handleClose}>Back</Button>

            <AnimateButton>
              <LoadingButton
                loading={loading}
                disableElevation
                disabled={!formData.name.trim() || loading}
                loadingPosition="start"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Save
              </LoadingButton>
            </AnimateButton>
          </Stack>
        </Box>
      </Drawer>

      <ConfirmationDialog
        title={`Edit "${previousName}"`}
        sx={{ width: 500 }}
        description={
          <Box>
            <Typography>
              Are you sure you want to change <Box component='span' color='error.main'>{previousName}</Box> to <Box component='span' color='primary.main'>{currentName}</Box>?
            </Typography>
            <Typography>
              This change will update all amenities using this type to <Box component='span' color='primary.main'>{currentName}</Box>.
            </Typography>
          </Box>
        }
        handleConfirm={handleEditConfirm}
        open={openConfirmDialog}
        handleClose={() => setOpenConfirmDialog(false)}
      />
    </React.Fragment>
  );
};

export default AmenityTypeDrawer;