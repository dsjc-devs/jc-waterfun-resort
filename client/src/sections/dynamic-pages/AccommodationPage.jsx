import React, { useState } from 'react';
import { CheckOutlined, ClockCircleOutlined, CloseOutlined, DeleteOutlined, DollarOutlined, EditOutlined, MenuOutlined, MoneyCollectOutlined, PayCircleOutlined, UserOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

import agent from 'api';
import AnimateButton from 'components/@extended/AnimateButton';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Loader from 'components/Loader';
import IconButton from 'components/@extended/IconButton';
import LabeledValue from 'components/LabeledValue';
import formatPeso from 'utils/formatPrice';

const AccommodationPage = ({ data, isLoading, isOnPortal = true }) => {
  const navigate = useNavigate();
  const {
    name,
    _id,
    thumbnail,
    pictures,
    type,
    description,
    capacity,
    price,
    maxStayDuration,
    extraPersonFee,
    status,
    notes
  } = data || {};

  const transformedPictures = pictures?.map((pic) => pic?.image) || [];
  const _pictures = [thumbnail, ...transformedPictures];

  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleEdit = (id) => {
    navigate(`/portal/accommodations/form?id=${id}&isEditMode=true`);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await agent.Accommodations.deleteAccommodation(id);
      toast.success('Deleted successfully.', { position: 'top-right', autoClose: 3000 });
      navigate(`/portal/accommodations?type=${type}`);
    } catch (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  const openViewer = (img) => {
    setCurrentImage(img);
    setViewerOpen(true);
  };

  const openGallery = () => {
    setGalleryOpen(true);
  };

  return (
    <React.Fragment>
      {(loading || isLoading) && (
        <React.Fragment>
          <Loader />
          <EmptyUserCard title='Loading...' />
        </React.Fragment>
      )}

      {isOnPortal && (
        <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={1}>
          <AnimateButton>
            <Button
              variant='contained'
              color='info'
              startIcon={<EditOutlined />}
              onClick={() => handleEdit(_id)}
            >
              Edit
            </Button>
          </AnimateButton>
          <AnimateButton>
            <Button
              variant='contained'
              color='error'
              startIcon={<DeleteOutlined />}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </AnimateButton>
        </Stack>
      )}

      <Box>
        <Box sx={{ position: 'relative' }}>
          <ImageList
            sx={{ width: '100%', height: "100%" }}
            variant="quilted"
            cols={3}
            rowHeight={200}
            style={{ borderRadius: "14px" }}
          >
            {_pictures?.slice(0, 3)?.map((item, index) => (
              <ImageListItem
                key={item}
                cols={index === 0 ? 2 : 1}
                rows={index === 0 ? 2 : 1}
              >
                <img
                  alt={item}
                  src={item}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                  onClick={() => openViewer(item)}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <Stack
            sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 99 }}
          >
            <Button
              sx={{
                background: '#fff',
                color: '#333',
                '&:hover': { background: '#333', color: '#fff' }
              }}
              variant='contained'
              startIcon={<MenuOutlined />}
              onClick={openGallery}
            >
              Show all photos
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box marginBlockEnd={2}>
              <Typography variant='h2'>{name}</Typography>
              <Typography variant='body1' color='secondary'>{description}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3} marginBlock={2}>
              {isOnPortal && (
                <Grid item xs={12} sm={6} md={4}>
                  <LabeledValue
                    title="Status"
                    subTitle={
                      <Chip
                        label={status}
                        color={{
                          POSTED: "success",
                          ARCHIVED: "error",
                        }[status]}
                        size="small"
                      />
                    }
                    icon={<CheckOutlined style={{ fontSize: 20 }} />}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Capacity"
                  subTitle={`${capacity} Guests`}
                  icon={<UserOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Day Price"
                  subTitle={formatPeso(price?.day)}
                  icon={<PayCircleOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Night Price"
                  subTitle={formatPeso(price?.night)}
                  icon={<PayCircleOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Extra Person Fee"
                  subTitle={formatPeso(extraPersonFee)}
                  icon={<DollarOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Max Stay"
                  subTitle={`${maxStayDuration} Hours`}
                  icon={<ClockCircleOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />
            {notes && <Box marginBlock='2em' dangerouslySetInnerHTML={{ __html: notes }} />}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: 'sticky',
                top: 80,
              }}
            >
              Reservation Section
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Stack direction='row' justifyContent='flex-end'>
          <IconButton onClick={() => setViewerOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <DialogContent
          sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
        >
          <img
            src={currentImage}
            alt="Accommodation"
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <Stack direction='row' justifyContent='flex-end'>
          <IconButton onClick={() => setGalleryOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <DialogContent dividers>
          <ImageList variant="masonry" cols={3} gap={8}>
            {_pictures?.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={img}
                  alt={`accommodation-${index}`}
                  loading="lazy"
                  style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => openViewer(img)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        title={`Delete ${name}`}
        description={`Are you sure you want to delete ${name}?`}
        handleConfirm={() => handleDelete(_id)}
        open={isDeleteOpen}
        handleClose={() => setIsDeleteOpen(false)}
      />
    </React.Fragment>
  );
};

export default AccommodationPage;

