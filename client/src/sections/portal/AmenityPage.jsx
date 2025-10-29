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
  Typography,
  Container,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Backdrop
} from '@mui/material';
import { EyeOutlined, EditOutlined, DeleteOutlined, MenuOutlined, CloseOutlined, StarFilled, CameraOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import agent from 'api';
import AnimateButton from 'components/@extended/AnimateButton';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import Loader from 'components/Loader';
import IconButton from 'components/@extended/IconButton';
import LabeledValue from 'components/LabeledValue';
import ConfirmationDialog from 'components/ConfirmationDialog';
import useGetPosition from 'hooks/useGetPosition';
import textFormatter from 'utils/textFormatter';

const AmenityPage = ({ data, isLoading, isOnPortal = true }) => {
  const { isCustomer } = useGetPosition();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

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
    features = []
  } = data || {};

  const transformedPictures = pictures?.map((pic) => pic?.image) || [];
  const _pictures = [thumbnail, ...transformedPictures];

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
    const index = _pictures.findIndex(picture => picture === img);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setViewerOpen(true);
  };

  const openGallery = () => {
    setGalleryOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? _pictures.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === _pictures.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 50%, #f0f7ff 100%)',
        minHeight: '100vh',
        position: 'relative',
        width: '100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(25, 118, 210, 0.02) 0%, transparent 60%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 2, md: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
        {(loading || isLoading) && (
          <Box sx={{ py: 8 }}>
            <Loader />
            <EmptyUserCard title='Loading premium amenity details...' />
          </Box>
        )}

        {isOnPortal && (
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent>
              <Stack
                direction={isMobile ? 'column' : 'row'}
                justifyContent='space-between'
                alignItems={isMobile ? 'stretch' : 'center'}
                spacing={2}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Cinzel',
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 0.5
                    }}
                  >
                    Amenity Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage this premium resort amenity
                  </Typography>
                </Box>

                <Stack
                  direction={isMobile ? 'column' : 'row'}
                  spacing={1.5}
                  sx={{ width: isMobile ? '100%' : 'auto' }}
                >
                  {!isCustomer && (
                    <AnimateButton>
                      <Button
                        variant='outlined'
                        startIcon={<EyeOutlined />}
                        onClick={() => window.open(`/amenities/details/${_id}`)}
                        fullWidth={isMobile}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          borderColor: 'primary.main',
                          '&:hover': {
                            background: 'primary.main',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          }
                        }}
                      >
                        Public View
                      </Button>
                    </AnimateButton>
                  )}

                  {!isCustomer && (
                    <React.Fragment>
                      <AnimateButton>
                        <Button
                          variant='contained'
                          startIcon={<EditOutlined />}
                          onClick={() => handleEdit(_id)}
                          fullWidth={isMobile}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                            }
                          }}
                        >
                          Edit Amenity
                        </Button>
                      </AnimateButton>
                      <AnimateButton>
                        <Button
                          variant='contained'
                          color='error'
                          startIcon={<DeleteOutlined />}
                          onClick={() => setIsDeleteOpen(true)}
                          fullWidth={isMobile}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 16px rgba(211, 47, 47, 0.4)',
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </AnimateButton>
                    </React.Fragment>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Hero Image Gallery Section */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <ImageList
              sx={{
                width: '100%',
                height: isMobile ? 350 : isTablet ? 450 : 600,
                margin: 0,
              }}
              variant="quilted"
              cols={_pictures.length === 1 ? 1 : _pictures.length === 2 ? 2 : 3}
              rowHeight={isMobile ? 175 : isTablet ? 225 : 300}
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
                  sx={{
                    overflow: 'hidden',
                    '&:hover img': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <img
                    alt={`${name} - Image ${index + 1}`}
                    src={item}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onClick={() => openViewer(item)}
                  />

                  {/* Enhanced image overlay with better gradient */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)',
                      pointerEvents: 'none',
                      opacity: 0.8,
                    }}
                  />

                  {/* Bottom gradient for text readability */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40%',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                      pointerEvents: 'none',
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>

            {/* Floating Gallery Button */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: 16, md: 24 },
                right: { xs: 16, md: 24 },
                zIndex: 2
              }}
            >
              <AnimateButton>
                <Button
                  variant='contained'
                  startIcon={<CameraOutlined />}
                  onClick={openGallery}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'text.primary',
                    borderRadius: 3,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.5 },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    fontWeight: 600,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(25, 118, 210, 0.95)',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(25, 118, 210, 0.3)',
                    }
                  }}
                >
                  {_pictures.length > 3 ? `View All ${_pictures.length} Photos` : 'View Gallery'}
                </Button>
              </AnimateButton>
            </Box>
          </Box>
        </Card>

        {/* Main Content Section */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12}>
            {/* Amenity Header */}
            <Card
              sx={{
                mb: 6,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(255, 167, 38, 0.3)',
                      }}
                    >
                      <StarFilled style={{ color: 'white', fontSize: '1.2rem' }} />
                    </Box>
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: 'Cinzel',
                        fontWeight: 700,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                        background: 'linear-gradient(135deg, #1976d2 0%, #634131 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {name}
                    </Typography>
                  </Box>

                  <Typography
                    variant='h5'
                    color='text.secondary'
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.35rem' },
                      lineHeight: 1.8,
                      maxWidth: '900px',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      mb: 2,
                    }}
                  >
                    {description}
                  </Typography>

                  {/* Premium amenity badge */}
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label="Premium Resort Amenity"
                      sx={{
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        px: 2,
                        py: 0.5,
                        height: 'auto',
                        '& .MuiChip-label': {
                          px: 1,
                          py: 1,
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Enhanced Amenity Details Grid */}
                <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: 2 }}>
                  {isOnPortal && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: status === 'POSTED'
                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%)'
                            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 115, 115, 0.05) 100%)',
                          border: `2px solid ${status === 'POSTED' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 25px ${status === 'POSTED' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`,
                          }
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 700, fontSize: '0.95rem' }}>
                          Status
                        </Typography>
                        <Chip
                          label={status}
                          color={status === 'POSTED' ? "success" : "error"}
                          size="large"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            px: 2,
                            py: 1,
                            height: 'auto',
                            '& .MuiChip-label': { px: 1, py: 0.5 }
                          }}
                        />
                      </Card>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(100, 181, 246, 0.05) 100%)',
                        border: '2px solid rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, 0.2)',
                        }
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 700, fontSize: '0.95rem' }}>
                        Amenity Type
                      </Typography>
                      <Chip
                        label={textFormatter.fromSlug(type)}
                        color="primary"
                        size="large"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          px: 2,
                          py: 1,
                          height: 'auto',
                          '& .MuiChip-label': { px: 1, py: 0.5 }
                        }}
                      />
                    </Card>
                  </Grid>

                  {capacity && (
                    <Grid item xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(99, 65, 49, 0.1) 0%, rgba(161, 136, 127, 0.05) 100%)',
                          border: '2px solid rgba(99, 65, 49, 0.3)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 25px rgba(99, 65, 49, 0.2)',
                          }
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 700, fontSize: '0.95rem' }}>
                          Guest Capacity
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{
                            color: '#634131',
                            fontWeight: 700,
                            fontSize: '1.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          👥 {capacity} Guests
                        </Typography>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Enhanced Additional Notes Section */}
            {notes && (
              <Card
                sx={{
                  mb: 6,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                      }}
                    >
                      <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>ℹ️</Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: 'Cinzel',
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                        background: 'linear-gradient(135deg, #1976d2 0%, #634131 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Additional Information
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 4, bgcolor: 'rgba(25, 118, 210, 0.1)', height: 2 }} />

                  <Box
                    sx={{
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        fontFamily: 'Cinzel',
                        color: 'primary.main',
                        fontWeight: 700,
                        mb: 3,
                        lineHeight: 1.3,
                      },
                      '& p': {
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        lineHeight: 1.8,
                        color: 'text.secondary',
                        mb: 3,
                        fontFamily: 'Inter, sans-serif',
                      },
                      '& ul, & ol': {
                        paddingLeft: 3,
                        mb: 3,
                        '& li': {
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          lineHeight: 1.8,
                          color: 'text.secondary',
                          mb: 2,
                          fontFamily: 'Inter, sans-serif',
                        }
                      },
                      '& img': {
                        borderRadius: 3,
                        maxWidth: '100%',
                        height: 'auto',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        mb: 3,
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: notes }}
                  />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Enhanced Carousel Image Viewer Dialog */}
      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            maxHeight: '95vh',
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' }
        }}
      >
        <Box sx={{ position: 'relative', height: '100%' }}>
          {/* Header with close button and image counter */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              zIndex: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: { xs: '0.9rem', md: '1.1rem' }
              }}
            >
              {currentImageIndex + 1} / {_pictures.length}
            </Typography>

            <IconButton
              onClick={() => setViewerOpen(false)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                size: 'large',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                }
              }}
            >
              <CloseOutlined style={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Box>

          {/* Main image display */}
          <DialogContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: { xs: 2, md: 4 },
              minHeight: '70vh',
              position: 'relative',
            }}
          >
            <Fade in={viewerOpen} timeout={300}>
              <img
                src={_pictures[currentImageIndex]}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  borderRadius: 12,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                  objectFit: 'contain',
                }}
              />
            </Fade>

            {/* Navigation arrows */}
            {_pictures.length > 1 && (
              <>
                <IconButton
                  onClick={goToPrevious}
                  sx={{
                    position: 'absolute',
                    left: { xs: 8, md: 24 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    size: 'large',
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    '&:disabled': {
                      opacity: 0.3,
                    }
                  }}
                >
                  <LeftOutlined style={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>

                <IconButton
                  onClick={goToNext}
                  sx={{
                    position: 'absolute',
                    right: { xs: 8, md: 24 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    size: 'large',
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    '&:disabled': {
                      opacity: 0.3,
                    }
                  }}
                >
                  <RightOutlined style={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} />
                </IconButton>
              </>
            )}
          </DialogContent>

          {/* Thumbnail navigation */}
          {_pictures.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
                maxWidth: '90%',
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: 4,
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                },
              }}
            >
              {_pictures.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  sx={{
                    minWidth: 60,
                    height: 60,
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: currentImageIndex === index ? '3px solid #1976d2' : '2px solid transparent',
                    opacity: currentImageIndex === index ? 1 : 0.6,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      opacity: 1,
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Enhanced Gallery Dialog */}
      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        fullWidth
        maxWidth="xl"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8fbff 0%, #ffffff 100%)',
          }
        }}
      >
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'background.paper', borderRadius: '12px 12px 0 0' }}>
          <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Cinzel', fontWeight: 600, color: 'primary.main' }}>
              {name} Gallery
            </Typography>
            <IconButton
              onClick={() => setGalleryOpen(false)}
              sx={{
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.2)',
                }
              }}
            >
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider />
        </Box>

        <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
          <ImageList
            variant="masonry"
            cols={isMobile ? 1 : isTablet ? 2 : 3}
            gap={16}
          >
            {_pictures?.map((img, index) => (
              <ImageListItem
                key={index}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <img
                  src={img}
                  alt={`${name} - Image ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    transition: 'transform 0.3s ease',
                  }}
                  onClick={() => openViewer(img)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </Dialog>

      {/* Enhanced Confirmation Dialog */}
      <ConfirmationDialog
        title={`Delete ${name}`}
        description={`Are you sure you want to permanently delete this premium amenity? This action cannot be undone.`}
        handleConfirm={() => handleDelete(_id)}
        open={isDeleteOpen}
        handleClose={() => setIsDeleteOpen(false)}
      />
    </Box>
  );
};

export default AmenityPage;