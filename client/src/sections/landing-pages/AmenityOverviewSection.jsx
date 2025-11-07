import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowRightOutlined, EyeOutlined } from '@ant-design/icons';
import { useGetAmenities } from 'api/amenities';
import TitleTag from 'components/TitleTag2';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import textFormatter from 'utils/textFormatter';

const AmenityOverviewSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { data, isLoading } = useGetAmenities({
    status: "POSTED",
    limit: 6,
    page: 1
  });

  const { amenities = [] } = data || {};

  const handleViewAll = () => {
    navigate('/amenities');
  };

  const handleViewAmenity = (id) => {
    navigate(`/amenities/details/${id}`);
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 50%, #f0f7ff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.02) 0%, transparent 60%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container>
        <React.Fragment>
          <Box textAlign="center">
            <TitleTag
              title="Resort Amenities"
              subtitle=" From refreshing pools to exciting recreational areas, explore the variety of amenities that make your stay unforgettable"
            />
          </Box>

          {isLoading && (
            <Grid container spacing={3}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Grid item xs={12} sm={6} md={6} key={idx}>
                  <EmptyUserCard />
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && amenities.length > 0 && (
            <Grid container spacing={3}>
              {amenities.map((amenity, index) => (
                <Grid item xs={12} sm={6} md={6} key={amenity._id || index}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                        '& .amenity-image': {
                          transform: 'scale(1.05)',
                        },
                        '& .view-button': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        height={200}
                        image={amenity.thumbnail || '/placeholder-amenity.jpg'}
                        alt={amenity.name}
                        className="amenity-image"
                        sx={{
                          transition: 'transform 0.3s ease',
                          objectFit: 'cover',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.5
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize'
                          }}
                        >
                          {textFormatter.fromSlug(amenity.type)}
                        </Typography>
                      </Box>
                      <Button
                        className="view-button"
                        variant="contained"
                        size="small"
                        startIcon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAmenity(amenity._id);
                        }}
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          left: 12,
                          opacity: 0,
                          transform: 'translateY(10px)',
                          transition: 'all 0.3s ease',
                          borderRadius: 2,
                          minWidth: 'auto',
                          px: 2
                        }}
                      >
                        View
                      </Button>
                    </Box>

                    <CardContent
                      sx={{
                        p: { xs: 2, md: 3 },
                        '&:last-child': { pb: { xs: 2, md: 3 } }
                      }}
                      onClick={() => handleViewAmenity(amenity._id)}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Cinzel',
                          fontWeight: 600,
                          color: 'text.primary',
                          mb: 1,
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          lineHeight: 1.3
                        }}
                      >
                        {amenity.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.875rem', md: '0.9rem' },
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {amenity.description || 'Experience this amazing amenity at our resort.'}
                      </Typography>

                      {amenity.capacity && (
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          >
                            Capacity: {amenity.capacity} guests
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {!isLoading && amenities.length === 0 && (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Cinzel',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 2
                }}
              >
                No Amenities Available
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: '400px', mx: 'auto' }}
              >
                We're currently updating our amenities. Please check back soon for exciting new offerings!
              </Typography>
            </Box>
          )}

          {!isLoading && amenities.length > 0 && (
            <Box sx={{ textAlign: 'center', pt: 2 }}>
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                endIcon={<ArrowRightOutlined />}
                onClick={handleViewAll}
                sx={{
                  borderRadius: 3,
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                    background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  }
                }}
              >
                View All Amenities
              </Button>
            </Box>
          )}
        </React.Fragment>
      </Container>
    </Box>
  );
};

export default AmenityOverviewSection;