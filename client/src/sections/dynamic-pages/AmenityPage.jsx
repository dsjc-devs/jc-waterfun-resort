import React, { useState } from 'react';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LeftOutlined,
  MenuOutlined,
  RightOutlined,
  UserOutlined
} from '@ant-design/icons';
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
import useGetPosition from 'hooks/useGetPosition';
import textFormatter from 'utils/textFormatter';
import formatPeso from 'utils/formatPrice';
import { PESO_SIGN } from 'constants/constants';

const AmenityPage = ({ data, isLoading, isOnPortal = true }) => {
  const { isCustomer } = useGetPosition();
  const navigate = useNavigate();

  const {
    name,
    _id,
    thumbnail,
    pictures,
    type,
    description,
    notes,
    status,
    capacity,
    features = [],
    hasPrice,
    price
  } = data || {};

  const transformedPictures = pictures?.map((pic) => pic?.image) || [];
  // Ensure no undefined entries render causing react warnings
  const _pictures = [thumbnail, ...transformedPictures].filter(Boolean);

  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleEdit = (id) => {
    navigate(`/portal/amenities/form?id=${id}&isEditMode=true&type=${type}`);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await agent.Amenities.deleteAmenity(id);
      toast.success('Deleted successfully.', { position: 'top-right', autoClose: 3000 });
      navigate(`/portal/amenities?type=${type}`);
    } catch (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  const openViewer = (img) => {
    const index = _pictures.findIndex(picture => picture === img);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setViewerOpen(true);
  };

  const openGallery = () => {
    setGalleryOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? _pictures.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === _pictures.length - 1 ? 0 : prevIndex + 1
    );
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
        <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={2}>
          {!isCustomer && (
            <React.Fragment>
              <AnimateButton>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<EyeOutlined />}
                  onClick={() => window.open(`/amenities/details/${_id}`)}
                >
                  Public view
                </Button>
              </AnimateButton>
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
            </React.Fragment>
          )}
        </Stack>
      )}

      <Box marginBlock={2}>
        <Box sx={{ position: 'relative', my: 2 }}>
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
            sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1 }}
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

        <Grid container spacing={2} marginBlock={2} direction={{ xs: 'column-reverse', md: 'row' }}>
          <Grid item xs={12} marginBlockEnd={2}>
            <Box marginBlockEnd={2}>
              <Typography variant='h2' gutterBottom>{name}</Typography>
              <Typography variant='body1' color='secondary'>{description}</Typography>
            </Box>

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
                  title="Type"
                  subTitle={textFormatter.fromSlug(type)}
                  icon={<CheckOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Pricing"
                  subTitle={hasPrice && price ? (
                    <Chip
                      label={`${formatPeso(price)}`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  ) : (
                    <Chip
                      label="Included"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                  icon={<Typography fontSize={24}>{PESO_SIGN}</Typography>}
                />
              </Grid>

              {capacity && (
                <Grid item xs={12} sm={6} md={4}>
                  <LabeledValue
                    title="Capacity"
                    subTitle={`${capacity} Guests`}
                    icon={<UserOutlined style={{ fontSize: 20 }} />}
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {/* Feature Chips */}
            {features?.length > 0 && (
              <Stack direction="row" flexWrap="wrap" gap={1} mb={4}>
                {features.map((f, idx) => (
                  <Chip key={idx} label={f} size="small" variant="outlined" />
                ))}
              </Stack>
            )}

            {/* Pricing Highlight */}
            <Box
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 2,
                bgcolor: hasPrice ? 'primary.dark' : 'success.dark',
                color: 'common.white',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                {hasPrice && price ? 'Amenity Rate' : 'Complimentary Amenity'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {hasPrice && price
                  ? `Current price for this amenity is ${formatPeso(price)}. Rates may change without prior notice.`
                  : 'This amenity is included with your stay. Availability may vary based on maintenance or scheduling.'}
              </Typography>
            </Box>

            {notes && (
              <Box marginBlock={5}>
                <Box dangerouslySetInnerHTML={{ __html: notes }} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', minHeight: '80vh' }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setViewerOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseOutlined />
          </IconButton>

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              {currentImageIndex + 1} / {_pictures.length}
            </Typography>
          </Box>

          {/* Main Image */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh',
              position: 'relative',
            }}
          >
            {/* Previous Button */}
            <IconButton
              onClick={goToPrevious}
              disabled={_pictures.length <= 1}
              sx={{
                position: 'absolute',
                left: 16,
                zIndex: 5,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  opacity: 0.3,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <LeftOutlined style={{ fontSize: '24px' }} />
            </IconButton>

            {/* Current Image */}
            <Box
              component="img"
              src={_pictures[currentImageIndex]}
              alt={`Amenity ${currentImageIndex + 1}`}
              sx={{
                maxWidth: '90%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.5s ease',
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'scale(0.95)' },
                  '100%': { opacity: 1, transform: 'scale(1)' }
                }
              }}
            />

            {/* Next Button */}
            <IconButton
              onClick={goToNext}
              disabled={_pictures.length <= 1}
              sx={{
                position: 'absolute',
                right: 16,
                zIndex: 5,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  opacity: 0.3,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <RightOutlined style={{ fontSize: '24px' }} />
            </IconButton>
          </Box>

          {/* Thumbnail Strip */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              p: 3,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.5)',
                },
              },
            }}
          >
            {_pictures.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 80,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: currentImageIndex === index
                    ? '3px solid rgba(255, 255, 255, 0.8)'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  opacity: currentImageIndex === index ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.05)',
                    border: '3px solid rgba(255, 255, 255, 0.6)',
                  },
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
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
                  alt={`amenity-${index}`}
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

export default AmenityPage;