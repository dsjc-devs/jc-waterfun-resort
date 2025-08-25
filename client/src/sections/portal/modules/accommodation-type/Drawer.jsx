import { Box, Button, Divider, Drawer, Stack, TextField, Typography } from '@mui/material';
import agent from 'api';
import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import ConfirmationDialog from 'components/ConfirmationDialog';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AccommodationTypeDrawer = ({ open, handleClose, mutate, typeData }) => {
  const [formData, setFormData] = useState({ title: '' });
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(false);

  const isEditMode = !!typeData?._id

  const previousTitle = typeData?.title
  const currentTitle = formData?.title

  useEffect(() => {
    if (typeData) {
      setFormData({ title: typeData?.title || '' });
    } else {
      setFormData({ title: '' });
    }
  }, [typeData, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        setOpenConfirmDialog(true)
      } else {
        setLoading(true)
        await agent.AccommodationType.addAccommodation(formData)
        toast.success(`${currentTitle} has been successfully added.`)
        handleClose()
      }
    } catch (error) {
      toast.error(error?.message || "Error Occured")
      console.error(error);
    } finally {
      setLoading(false)
      await mutate()
    }
  };

  const handleEditConfirm = async () => {
    setLoading(true)
    try {
      await agent.AccommodationType.editAccommodationType(typeData?._id, formData)
      await mutate()
      setOpenConfirmDialog(false)
    } catch (error) {
      toast.error(error?.message || "Error Occured")
      console.error(error);
    } finally {
      setLoading(false)
      handleClose()
    }
  }

  return (
    <React.Fragment>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleClose}
      >
        <Box sx={{ width: { xs: 300, md: 500 }, position: 'relative', height: '100%' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h2">{isEditMode ? `Edit ${previousTitle}` : 'Create New Type'}</Typography>
            <Typography variant="body1" color="secondary" gutterBottom>
              {isEditMode ? 'Edit existing accommodation type' : 'Add a new accommodation type'}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ p: 2, pt: 3 }}>
            <Typography>Title (Required)</Typography>
            <TextField
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g Cottage, Room, Event Hall"
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
                disabled={!formData.title.trim() || loading}
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
        title={`Edit "${previousTitle}"`}
        sx={{ width: 500 }}
        description={
          <Box>
            <Typography>
              Are you sure you want to change <Box component='span' color='error.main'>{previousTitle}</Box> to <Box component='span' color='primary.main'>{currentTitle}</Box>?
            </Typography>
            <Typography>
              This change will also update 3 rooms to use the new type <Box component='span' color='primary.main'>{currentTitle}</Box>.
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

export default AccommodationTypeDrawer;
