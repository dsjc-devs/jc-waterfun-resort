import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  alpha,
  useTheme,
  IconButton,
  Tooltip
} from '@mui/material';
import { ArrowRightOutlined, EyeOutlined } from '@ant-design/icons';
import { useGetAccommodationTypes } from 'api/accomodation-type';
import { useGetAccommodations } from 'api/accommodations';
import textFormatter from 'utils/textFormatter';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

const AccommodationTypePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { accomodationTypes, isLoading: typesLoading } = useGetAccommodationTypes();
  const { data: accommodationsData, isLoading: accommodationsLoading } = useGetAccommodations({ limit: 1000 });

  const isLoading = typesLoading || accommodationsLoading;

  const filteredTypes = accomodationTypes?.filter(type =>
    type.slug !== 'no_category' && type.count > 0
  ) || [];

  const getTypeImage = (slug) => {
    if (!accommodationsData?.accommodations) return null;
    const accommodation = accommodationsData.accommodations.find(acc => acc.type === slug);
    return accommodation?.thumbnail || null;
  };

  const handleViewType = (slug) => {
    navigate(`/accommodations?type=${slug}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '60vh', py: 8 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            {Array.from({ length: 4 }).map((_, idx) => (
              <Card
                key={`skeleton-${idx}`}
                sx={{
                  height: 300,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                  animation: 'pulse 1.5s ease-in-out infinite alternate',
                  borderRadius: 4
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!filteredTypes || filteredTypes.length === 0) {
    return (
      <Box sx={{ minHeight: '60vh', py: 8 }}>
        <Container maxWidth="xl">
          <EmptyUserCard title="No accommodation types found" />
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '70vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 50%, #fff3e0 100%)',
        py: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            🏖️ Discover Our Accommodations
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Experience paradise with our diverse range of premium accommodations, each designed for your perfect getaway
          </Typography>
        </Box>

        {/* Accommodation Types List */}
        <Stack spacing={6}>
          {filteredTypes.map((type) => {
            const count = type.count || 0;
            const formattedName = type.title;
            const typeImage = getTypeImage(type.slug);

            return (
              <Card
                key={type._id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  minHeight: { xs: 'auto', md: 300 },
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    '& .type-image': {
                      transform: 'scale(1.05)'
                    },
                    '& .view-button': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      transform: 'translateX(4px)'
                    }
                  }
                }}
              >
                {/* Type Image */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '45%' },
                    height: { xs: 250, md: 300 },
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {typeImage ? (
                    <CardMedia
                      component="img"
                      image={typeImage}
                      alt={formattedName}
                      className="type-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h2" sx={{ color: 'white', opacity: 0.8 }}>
                        🏖️
                      </Typography>
                    </Box>
                  )}

                  {/* Overlay Gradient */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.3) 0%, rgba(76, 175, 80, 0.3) 100%)',
                      opacity: 0.6
                    }}
                  />

                  {/* Count Badge */}
                  <Chip
                    label={`${count} Available`}
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      color: theme.palette.primary.main,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      '& .MuiChip-label': {
                        px: 2.5,
                        py: 0.5
                      }
                    }}
                  />
                </Box>

                {/* Card Content */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '55%' },
                    display: 'flex',
                    flexDirection: 'column',
                    p: { xs: 3, md: 4 }
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: 'primary.main',
                        fontSize: { xs: '1.75rem', md: '2.125rem' }
                      }}
                    >
                      {formattedName}
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        mb: 4,
                        lineHeight: 1.8,
                        fontSize: { xs: '1rem', md: '1.125rem' }
                      }}
                    >
                      {type.description || `Discover our premium ${formattedName?.toLowerCase()} designed for comfort and luxury. Perfect for your tropical getaway with world-class amenities and breathtaking views.`}
                    </Typography>

                    {/* Stats Row */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 4,
                        background: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                      }}
                    >
                      <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                        <Box textAlign="center">
                          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Available Units
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                            ⭐
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Premium Quality
                          </Typography>
                        </Box>
                        <Box textAlign="center">
                          <Typography variant="h5" color="success.main" sx={{ fontWeight: 700, mb: 0.5 }}>
                            🏖️
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Resort Access
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Action Button */}
                  <Button
                    className="view-button"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRightOutlined />}
                    onClick={() => handleViewType(type.slug)}
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      textTransform: 'capitalize',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      }
                    }}
                  >
                    Explore {formattedName}
                  </Button>
                </Box>
              </Card>
            );
          })}
        </Stack>

        {/* Bottom CTA Section */}
        <Box
          sx={{
            mt: 10,
            p: 6,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
            🌊 Ready for Your Perfect Getaway?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
            Browse our complete selection of accommodations and find your ideal tropical retreat at JC Water Fun Resort.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<EyeOutlined />}
            onClick={() => navigate('/book-now')}
            sx={{
              px: 6,
              py: 2,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              fontWeight: 600,
              fontSize: '1.25rem',
              textTransform: 'capitalize',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #388E3C 0%, #4CAF50 100%)',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Check Availability Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AccommodationTypePage;