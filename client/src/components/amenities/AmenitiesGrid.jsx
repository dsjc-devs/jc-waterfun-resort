import React from 'react';
import { Box, Button, Card, CardMedia, Chip, Container, Grid, Stack, Typography, useTheme, useMediaQuery } from '@mui/material';
import { EyeOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import AnimateButton from 'components/@extended/AnimateButton';
import textFormatter from 'utils/textFormatter';

const AmenitiesGrid = ({ amenityData, index }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const {
    _id,
    name,
    thumbnail,
    type,
    description,
    capacity,
    features = []
  } = amenityData || {};

  const isEven = index % 2 === 0;

  const handleViewDetails = () => {
    navigate(`/amenities/details/${_id}`);
  };

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6, md: 8, lg: 10 },
        bgcolor: isEven
          ? 'linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%)'
          : 'linear-gradient(135deg, #fff 0%, #fafcff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isEven
            ? 'radial-gradient(circle at 20% 80%, rgba(99, 65, 49, 0.03) 0%, transparent 50%)'
            : 'radial-gradient(circle at 80% 20%, rgba(25, 118, 210, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 6, lg: 8 }}
          alignItems="center"
          direction={isMobile ? 'column' : (isEven ? 'row' : 'row-reverse')}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: { xs: 2, md: 3 },
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }
              }}
            >
              <CardMedia
                component="img"
                image={thumbnail}
                alt={name}
                sx={{
                  height: { xs: 260, sm: 300, md: 340, lg: 400 },
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              />

              {/* Floating type badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 12, md: 16 },
                  left: { xs: 12, md: 16 },
                  zIndex: 2,
                }}
              >
                <Chip
                  label={textFormatter.fromSlug(type)}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    px: { xs: 1, md: 1.5 },
                    '& .MuiChip-label': {
                      px: { xs: 1, md: 1.5 },
                    }
                  }}
                />
              </Box>

              {/* Gradient overlay for better text readability */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={{ xs: 2.5, md: 3.5 }} sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' },
                    color: 'text.primary',
                    lineHeight: 1.2,
                    fontFamily: 'Cinzel',
                    mb: 1,
                    background: 'linear-gradient(135deg, #1976d2 0%, #634131 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarFilled style={{ color: '#ffa726', fontSize: '1rem' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    Premium Resort Amenity
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: 1.7,
                  maxWidth: { xs: 'none', md: '500px' },
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {description}
              </Typography>

              {/* Capacity info if available */}
              {capacity && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    Capacity: {capacity} guests
                  </Typography>
                </Box>
              )}

              <Box sx={{ pt: { xs: 1, md: 2 } }}>
                <AnimateButton>
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    startIcon={<EyeOutlined />}
                    onClick={handleViewDetails}
                    sx={{
                      borderRadius: { xs: 2, md: 3 },
                      px: { xs: 3, md: 5 },
                      py: { xs: 1.25, md: 1.75 },
                      fontSize: { xs: '0.95rem', md: '1.1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Explore This Amenity
                  </Button>
                </AnimateButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AmenitiesGrid;