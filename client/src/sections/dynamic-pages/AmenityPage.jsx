import React, { useState } from 'react';
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
import { EyeOutlined, EditOutlined, DeleteOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import agent from 'api';
import AnimateButton from 'components/@extended/AnimateButton';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import Loader from 'components/Loader';
import IconButton from 'components/@extended/IconButton';
import LabeledValue from 'components/LabeledValue';
import formatPeso from 'utils/formatPrice';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useGetPosition from 'hooks/useGetPosition';
import textFormatter from 'utils/textFormatter';

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
    price
  } = data || {};

  const transformedPictures = pictures?.map((pic) => pic?.image) || [];
  const _pictures = [thumbnail, ...transformedPictures];

  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleEdit = (id) => {
    navigate(`/portal/amenities/form?id=${id}&isEditMode=true&type=${type}`);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await agent.Amenities.deleteAmenity(id);
      toast.success('Deleted successfully.');
      navigate(`/portal/amenities?type=${type}`);
    } catch (error) {
      toast.error(error);
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
        <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={2}>
          {!isCustomer && (
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
          )}

          {!isCustomer && (
            <React.Fragment>
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
            cols={_pictures.length === 1 ? 1 : _pictures.length === 2 ? 2 : 3}
            rowHeight={200}
            style={{ borderRadius: "14px" }}
          >
            {_pictures?.slice(0, 3)?.map((item, index) => (
              <ImageListItem
                key={item}
                cols={
                  _pictures.length === 1 ? 1 :
                    _pictures.length === 2 ? 1 :
                      index === 0 ? 2 : 1
                }
                rows={
                  _pictures.length === 1 ? 1 :
                    _pictures.length === 2 ? 1 :
                      index === 0 ? 2 : 1
                }
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
          <Grid item xs={12} md={isOnPortal ? 12 : 8} marginBlockEnd={2}>
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
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Type"
                  subTitle={<Chip label={textFormatter.fromSlug(type)} color="primary" size="small" />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Price"
                  subTitle={formatPeso(price)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

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
            alt="Amenity"
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