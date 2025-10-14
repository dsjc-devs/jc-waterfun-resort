import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

import carouselApi, { useGetCarousels } from 'api/carousel';
import ConfirmationDialog from 'components/ConfirmationDialog';
import MultiFileUpload from 'components/dropzone/MultiFile';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

const createDefaultForm = () => ({
  files: []
});

const CarouselList = () => {
  const { data, isLoading, mutate } = useGetCarousels({ page: 1, limit: 50 });
  const carousels = useMemo(() => data?.carousels || [], [data]);

  const [addOpen, setAddOpen] = useState(false);
  const [formValues, setFormValues] = useState(() => createDefaultForm());
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    const availableIds = new Set(carousels.map((item) => item._id));
    setSelectedIds((prev) => {
      const filtered = prev.filter((id) => availableIds.has(id));
      return filtered.length === prev.length ? prev : filtered;
    });
  }, [carousels]);

  const resetForm = () => {
    setFormValues(createDefaultForm());
    setFormErrors({});
  };

  const handleOpenAdd = () => {
    resetForm();
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    if (!saving) {
      setAddOpen(false);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const nextErrors = {};
    if (!formValues.files || formValues.files.length === 0) {
      nextErrors.files = 'At least one image is required';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const uploadPromises = formValues.files.map((file) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('isPosted', 'true');
        return carouselApi.CAROUSELS.addCarousel(formData);
      });

      await Promise.all(uploadPromises);
      toast.success(`${formValues.files.length} slide${formValues.files.length > 1 ? 's' : ''} added`);
      setAddOpen(false);
      resetForm();
      await mutate();
    } catch (error) {
      toast.error(error?.message || 'Failed to add carousel');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await carouselApi.CAROUSELS.deleteCarousel(deleteTarget._id);
      toast.success('Carousel deleted');
      setDeleteTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget._id));
      await mutate();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete carousel');
    }
  };

  const handleBulkDelete = async () => {
    if (bulkDeleting || selectedIds.length === 0) return;

    setBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map((id) => carouselApi.CAROUSELS.deleteCarousel(id)));
      toast.success(`${selectedIds.length} slide${selectedIds.length > 1 ? 's' : ''} deleted`);
      setSelectedIds([]);
      setBulkDialogOpen(false);
      await mutate();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete selected carousels');
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 8 }}>
      <Stack direction="row" justifyContent="flex-end" spacing={2} mb={4}>
        {selectedIds.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={bulkDeleting ? undefined : <DeleteIcon />}
            onClick={() => setBulkDialogOpen(true)}
            disabled={bulkDeleting}
          >
            {bulkDeleting ? <CircularProgress size={20} color="inherit" /> : `Delete Selected (${selectedIds.length})`}
          </Button>
        )}
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Carousel
        </Button>
      </Stack>

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" sx={{ height: 260, borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : carousels.length === 0 ? (
        <EmptyUserCard title="No carousel slides yet. Start by uploading your first carousel image." />
      ) : (
        <Grid container spacing={3}>
          {carousels.map((carousel) => {
            const isSelected = selectedIds.includes(carousel._id);

            return (
              <Grid item xs={12} sm={6} md={4} key={carousel._id}>
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(11,79,113,0.12)',
                    border: isSelected ? '3px solid #1e88e5' : '3px solid transparent'
                  }}
                >
                  <Box
                    component="img"
                    src={carousel.image}
                    alt={carousel.title}
                    sx={{
                      width: '100%',
                      aspectRatio: '16/9',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      zIndex: 2,
                      bgcolor: 'rgba(0,0,0,0.45)',
                      borderRadius: '50%'
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleToggleSelect(carousel._id)}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 24 }
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      zIndex: 2
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteTarget(carousel)}
                      sx={{ borderRadius: 999, px: 2.5, fontWeight: 600 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={addOpen}
        onClose={handleCloseAdd}
        maxWidth="sm"
        fullWidth
        component="form"
        onSubmit={handleSubmit}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Add Carousel Slide
          </Typography>
          <IconButton onClick={handleCloseAdd} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} mt={1}>
            <Box>
              <Typography variant="subtitle2" mb={1}>
                Images
              </Typography>
              <MultiFileUpload
                files={formValues.files}
                setFieldValue={(field, value) => {
                  setFormValues((prev) => ({ ...prev, files: value }));
                  setFormErrors((prev) => ({ ...prev, files: undefined }));
                }}
                hideButton
                showList
                acceptedFileTypes={{ 'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.svg'] }}
                maxFileSize={10}
              />
              {formErrors.files && (
                <Typography variant="caption" color="error" mt={0.5} display="block">
                  {formErrors.files}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseAdd} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={bulkDialogOpen}
        handleClose={() => setBulkDialogOpen(false)}
        handleConfirm={handleBulkDelete}
        title="Delete Selected Carousels"
        description={`Are you sure you want to delete ${selectedIds.length} selected slide${selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.`}
      />

      <ConfirmationDialog
        open={Boolean(deleteTarget)}
        handleClose={() => setDeleteTarget(null)}
        handleConfirm={handleConfirmDelete}
        title="Delete Carousel"
        description="Are you sure you want to delete this carousel slide? This action cannot be undone."
      />
    </Container>
  );
};

export default CarouselList;