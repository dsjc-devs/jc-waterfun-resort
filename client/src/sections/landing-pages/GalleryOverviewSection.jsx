import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Skeleton,
  Dialog,
  DialogContent,
  IconButton,
  Backdrop
} from '@mui/material';
import {
  ArrowRightOutlined,
  CameraOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useGetGallery } from 'api/gallery';
import TitleTag from 'components/TitleTag2';

const GalleryOverviewSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const navigate = useNavigate();


  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const { data, isLoading } = useGetGallery({
    limit: 20, // Fetch more images to have variety
    page: 1
  });


  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };


  const randomGalleryImages = useMemo(() => {
    const allImages = data?.galleryImages || [];
    if (allImages.length === 0) return [];

    const shuffled = shuffleArray(allImages);
    return shuffled.slice(0, 8);
  }, [data?.galleryImages]);

  const handleViewGallery = () => {
    navigate('/gallery');
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? randomGalleryImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === randomGalleryImages.length - 1 ? 0 : prev + 1
    );
  };


  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'Escape') {
      handleCloseDialog();
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 50%, #ffffff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(99, 65, 49, 0.02) 0%, transparent 60%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container sx={{ paddingBlock: 4 }}>
        <React.Fragment>
          <TitleTag
            title="Resort Gallery"
            subtitle="Browse through stunning images that showcase the beauty, comfort, and excitement that awaits you at our resort"
          />

          {isLoading && (
            <Grid container spacing={2}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      aspectRatio: '4/3',
                      borderRadius: 2,
                      width: '100%'
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && randomGalleryImages.length > 0 && (
            <Grid container spacing={2}>
              {randomGalleryImages.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={image._id || index}>
                  <Box
                    className="gallery-item"
                    onClick={() => handleImageClick(index)}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      backgroundColor: '#f5f5f5',
                      aspectRatio: '4/3',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.common.black, 0.15)}`,
                        '& .overlay': {
                          opacity: 1,
                        },
                        '& img': {
                          transform: 'scale(1.05)',
                        }
                      }
                    }}
                  >
                    <img
                      src={image.image}
                      alt={image.category || `Gallery image ${index + 1}`}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.3s ease',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />

                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.8) 0%, rgba(99, 65, 49, 0.8) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <Stack alignItems="center" spacing={1}>
                        <CameraOutlined
                          style={{
                            fontSize: '2rem',
                            color: 'white'
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            textAlign: 'center',
                            textTransform: 'capitalize'
                          }}
                        >
                          {image.category || 'View Image'}
                        </Typography>
                      </Stack>
                    </Box>

                    {image.category && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          zIndex: 2
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            textTransform: 'capitalize'
                          }}
                        >
                          {image.category}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && randomGalleryImages.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Box
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  borderRadius: '50%',
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <CameraOutlined
                  style={{
                    fontSize: '2.5rem',
                    color: theme.palette.primary.main
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Cinzel',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                Gallery Coming Soon
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: '400px', mx: 'auto' }}
              >
                We're currently updating our gallery with beautiful images of our resort. Check back soon!
              </Typography>
            </Box>
          )}

          {!isLoading && randomGalleryImages.length > 0 && (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                startIcon={<CameraOutlined />}
                endIcon={<ArrowRightOutlined />}
                onClick={handleViewGallery}
                sx={{
                  borderRadius: 3,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #634131 0%, #8d5a3d 100%)',
                  boxShadow: '0 8px 25px rgba(99, 65, 49, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(99, 65, 49, 0.4)',
                    background: 'linear-gradient(135deg, #5a392b 0%, #634131 100%)',
                  }
                }}
              >
                View Full Gallery
              </Button>
            </Box>
          )}

          {!isLoading && randomGalleryImages.length > 0 && (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}
              >
                Showing {randomGalleryImages.length} random images of {data?.totalImages || data?.galleryImages?.length || 0} beautiful moments
              </Typography>
            </Box>
          )}
        </React.Fragment>
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
            maxWidth: '95vw',
            maxHeight: '95vh',
          }
        }}
        BackdropComponent={Backdrop}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
          }
        }}
        onKeyDown={handleKeyDown}
      >
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            '&:focus': {
              outline: 'none'
            }
          }}
        >
          {randomGalleryImages.length > 0 && (
            <>
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <CloseOutlined />
              </IconButton>

              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  zIndex: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {currentImageIndex + 1} / {randomGalleryImages.length}
              </Box>

              {randomGalleryImages[currentImageIndex]?.category && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    zIndex: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: 'primary.main',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                >
                  {randomGalleryImages[currentImageIndex].category}
                </Box>
              )}

              {randomGalleryImages.length > 1 && (
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LeftOutlined />
                </IconButton>
              )}

              {randomGalleryImages.length > 1 && (
                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-50%) scale(1.1)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RightOutlined />
                </IconButton>
              )}

              <Box
                component="img"
                src={randomGalleryImages[currentImageIndex]?.image}
                alt={randomGalleryImages[currentImageIndex]?.category || `Gallery image ${currentImageIndex + 1}`}
                sx={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                  borderRadius: 2,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />

              {randomGalleryImages.length > 1 && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: 1,
                    zIndex: 3
                  }}
                >
                  {randomGalleryImages.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: index === currentImageIndex
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'white',
                          transform: 'scale(1.2)'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GalleryOverviewSection;