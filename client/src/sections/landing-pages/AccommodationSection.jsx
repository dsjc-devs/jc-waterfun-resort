import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useGetFeaturedAccommodations } from 'api/accommodations';

import React from 'react';
import TitleTag from 'components/TitleTag2';
import RoomCard from 'components/accommodations/RoomCard';

const AccommodationSection = () => {
  const navigate = useNavigate();
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedAccommodations();

  const featuredAccommodations = featuredData?.data || [];

  const handleViewAll = () => {
    navigate('/accommodations');
  };

  const handleViewAccommodation = (id) => {
    navigate(`/accommodations/${id}`);
  };

  return (
    <Box
      sx={{
        py: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
          data-aos="fade-up"
        >
          <TitleTag title="Featured Accommodations" />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover our handpicked premium accommodations that offer the best experience for your stay
          </Typography>
        </Box>

        {!featuredLoading && featuredAccommodations.length > 0 && (
          <Grid
            container
            spacing={4}
            sx={{
              mb: 6,
              alignItems: 'stretch'
            }}
          >
            {featuredAccommodations.map((accommodation, index) => (
              <Grid
                item
                xs={12}
                md={4}
                key={accommodation._id}
                sx={{
                  display: 'flex'
                }}
              >
                <RoomCard
                  roomData={accommodation}
                  onView={() => handleViewAccommodation(accommodation._id)}
                  isOnPortal={false}
                  showFeaturedBadge={true}
                  variant="featured"
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!featuredLoading && featuredAccommodations.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(15px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              mb: 6
            }}
            data-aos="fade-up"
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No Featured Accommodations Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for our handpicked premium accommodations!
            </Typography>
          </Paper>
        )}

        <Box
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
          }}
          data-aos="fade-up"
        >
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            🌊 Explore All Our Accommodations
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleViewAll}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                fontWeight: 600,
                fontSize: '1.1rem',
                textTransform: 'capitalize',
                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                minWidth: 200,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
              endIcon={<ArrowRightOutlined />}
            >
              View All Accommodations
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AccommodationSection;