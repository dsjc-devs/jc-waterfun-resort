import { useGetGallery } from 'api/gallery'
import Banner from 'components/Banner'
import PageTitle from 'components/PageTitle'
import React, { useState, useMemo } from 'react'
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  Skeleton,
  Fade,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { Close, ZoomIn, ViewModule, Category, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import TitleTag2 from 'components/TitleTag2'

const Gallery = () => {
  const { data, isLoading } = useGetGallery()
  const { galleryImages } = data || {}
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedImage, setSelectedImage] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [viewMode, setViewMode] = useState('categorized')

  const categories = useMemo(() => {
    if (!galleryImages) return ['ALL']
    const uniqueCategories = [...new Set(galleryImages.map(img => img.category || 'UNCATEGORIZED'))]
    return ['ALL', ...uniqueCategories]
  }, [galleryImages])

  const filteredImages = useMemo(() => {
    if (!galleryImages) return []
    if (selectedCategory === 'ALL') return galleryImages
    return galleryImages.filter(img => (img.category || 'UNCATEGORIZED') === selectedCategory)
  }, [galleryImages, selectedCategory])

  // Group images by category
  const imagesByCategory = useMemo(() => {
    if (!galleryImages) return {}
    const grouped = galleryImages.reduce((acc, image) => {
      const category = image.category || 'UNCATEGORIZED'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(image)
      return acc
    }, {})
    return grouped
  }, [galleryImages])

  // Get current image index for navigation
  const currentImageIndex = useMemo(() => {
    if (!selectedImage) return -1
    const imagesToUse = viewMode === 'categorized' ? galleryImages : filteredImages
    return imagesToUse?.findIndex(img => img._id === selectedImage._id) ?? -1
  }, [selectedImage, galleryImages, filteredImages, viewMode])

  // Get total count for display
  const totalImages = useMemo(() => {
    const imagesToUse = viewMode === 'categorized' ? galleryImages : filteredImages
    return imagesToUse?.length ?? 0
  }, [galleryImages, filteredImages, viewMode])

  const handleImageClick = (image) => {
    setSelectedImage(image)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedImage(null)
  }

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode)
      if (newMode === 'categorized') {
        setSelectedCategory('ALL')
      }
    }
  }

  const handlePrevImage = () => {
    const imagesToUse = viewMode === 'categorized' ? galleryImages : filteredImages
    if (currentImageIndex > 0) {
      setSelectedImage(imagesToUse[currentImageIndex - 1])
    }
  }

  const handleNextImage = () => {
    const imagesToUse = viewMode === 'categorized' ? galleryImages : filteredImages
    if (currentImageIndex < (imagesToUse?.length ?? 0) - 1) {
      setSelectedImage(imagesToUse[currentImageIndex + 1])
    }
  }

  return (
    <React.Fragment>
      <PageTitle title="Gallery" isOnportal={false} />
      <Banner
        title='Gallery'
        subtitle='A collection of our memorable moments'
        image='https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      />

      <Box sx={{ backgroundColor: '#f4e8cf', py: 8 }}>
        <Container>
          <TitleTag2
            title="Resort Gallery"
            subtitle="Discover the beauty and experiences at our resort"
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode selection"
              sx={{
                borderRadius: 3,
                background: '#fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                p: 0.5,
                border: '1px solid #e0e0e0',
              }}
            >
              <ToggleButton
                value="categorized"
                aria-label="categorized view"
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  backgroundColor: viewMode === 'categorized' ? '#2a93c1' : '#fff',
                  color: viewMode === 'categorized' ? '#fff' : '#2a93c1',
                  fontWeight: 700,
                  fontFamily: 'Poppins',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: viewMode === 'categorized' ? '#1e7a9a' : '#e8f5fd',
                  },
                }}
              >
                <Category sx={{ mr: 1 }} />
                Categorized
              </ToggleButton>
              <ToggleButton
                value="all"
                aria-label="all images view"
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  backgroundColor: viewMode === 'all' ? '#2a93c1' : '#fff',
                  color: viewMode === 'all' ? '#fff' : '#2a93c1',
                  fontWeight: 700,
                  fontFamily: 'Poppins',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: viewMode === 'all' ? '#1e7a9a' : '#e8f5fd',
                  },
                }}
              >
                <ViewModule sx={{ mr: 1 }} />
                All Images
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {viewMode === 'all' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 6 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category.replace('_', ' ')}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'filled' : 'outlined'}
                  sx={{
                    backgroundColor: selectedCategory === category ? '#2a93c1' : 'transparent',
                    color: selectedCategory === category ? '#fff' : '#2a93c1',
                    fontWeight: 700,
                    fontFamily: 'Poppins',
                    px: 3,
                    py: 1,
                    fontSize: '0.9rem',
                    border: '2px solid #2a93c1',
                    '&:hover': {
                      backgroundColor: selectedCategory === category ? '#1e7a9a' : '#e8f5fd',
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {isLoading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 12 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={250}
                    sx={{ borderRadius: 3 }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : Object.keys(imagesByCategory).length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                background: '#fff',
                borderRadius: 3,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h5"
                color="#634131"
                fontFamily="Poppins"
                fontWeight={600}
                mb={2}
              >
                No images found
              </Typography>
              <Typography variant="body1" color="#634131">
                No images available in the gallery yet.
              </Typography>
            </Box>
          ) : viewMode === 'categorized' ? (
            // Categorized View
            Object.entries(imagesByCategory).map(([category, images]) => (
              <Box key={category} sx={{ mb: 8 }}>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  fontFamily="Poppins"
                  color="#2a93c1"
                  mb={4}
                  sx={{
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 100,
                      height: 4,
                      background: 'linear-gradient(90deg, #2a93c1 0%, #f29023 100%)',
                      borderRadius: 2,
                    },
                  }}
                >
                  {category.replace('_', ' ')}
                </Typography>

                <ImageList
                  sx={{
                    width: '100%',
                    height: 'auto',
                  }}
                  cols={4}
                  rowHeight={300}
                  gap={16}
                >
                  {images.map((image, index) => (
                    <ImageListItem
                      key={image._id}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                          '& .overlay': {
                            opacity: 1,
                          },
                          '& img': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image.image}
                        alt={`${category} ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
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
                          background: 'linear-gradient(135deg, rgba(42,147,193,0.8) 0%, rgba(242,144,35,0.8) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        <ZoomIn sx={{ color: '#fff', fontSize: 48 }} />
                      </Box>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            ))
          ) : (
            // All Images View with Filter
            <ImageList
              sx={{
                width: '100%',
                height: 'auto',
              }}
              cols={4}
              rowHeight={300}
              gap={16}
            >
              {filteredImages.map((image, index) => (
                <ImageListItem
                  key={image._id}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                      '& .overlay': {
                        opacity: 1,
                      },
                      '& img': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image.image}
                    alt={`Gallery image ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
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
                      background: 'linear-gradient(135deg, rgba(42,147,193,0.8) 0%, rgba(242,144,35,0.8) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <ZoomIn sx={{ color: '#fff', fontSize: 48 }} />
                  </Box>

                  <ImageListItemBar
                    sx={{
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      '& .MuiImageListItemBar-title': {
                        color: '#fff',
                        fontWeight: 600,
                        fontFamily: 'Poppins',
                        fontSize: '0.85rem',
                      },
                    }}
                    title={(image.category || 'UNCATEGORIZED').replace('_', ' ')}
                    position="top"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </Container>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              zIndex: 10,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            <Close />
          </IconButton>

          {currentImageIndex > 0 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 16,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <ArrowBackIos />
            </IconButton>
          )}

          {currentImageIndex < totalImages - 1 && (
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 16,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: '#fff',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          )}

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              px: 2,
              py: 1,
              borderRadius: 2,
              fontFamily: 'Poppins',
              fontSize: '0.9rem',
              zIndex: 10,
            }}
          >
            {currentImageIndex + 1} / {totalImages}
          </Box>

          {selectedImage && (
            <img
              src={selectedImage.image}
              alt="Full size gallery image"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default Gallery