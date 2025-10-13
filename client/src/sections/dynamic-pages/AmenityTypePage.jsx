import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  alpha,
  useTheme
} from '@mui/material';
import { EyeOutlined } from '@ant-design/icons';
import { useGetAmenityTypes } from 'api/amenity-type';
import { useGetAmenities } from 'api/amenities';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import AccommodationTypeCard from 'components/cards/AccommodationTypeCard';

const AmenityTypePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { amenityTypes, isLoading: typesLoading } = useGetAmenityTypes();
  const { data: amenitiesData, isLoading: amenitiesLoading } = useGetAmenities({ limit: 1000 });

  const isLoading = typesLoading || amenitiesLoading;

  const filteredTypes = amenityTypes?.filter(type =>
    type.slug !== 'no_category' && type.count > 0
  ) || [];

  const getTypeImage = (slug) => {
    if (!amenitiesData?.data && !amenitiesData?.amenities) return null;
    // some APIs return { data: { amenities: [...] } } or { amenities: [...] }
    const list = amenitiesData?.amenities || amenitiesData?.data?.amenities || amenitiesData?.data || [];
    const amenity = list.find(acc => acc.type === slug);
    return amenity?.thumbnail || null;
  };

  const handleViewType = (slug) => {
    navigate(`/amenities?type=${slug}`);
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
          <EmptyUserCard title="No amenity types found" />
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '70vh',
        background: 'linear-gradient(135deg, #87CEEB 0%, #E0F6FF 25%, #FFF8DC 50%, #FFE4B5 75%, #F0E68C 100%)',
        position: 'relative',
        py: { xs: 4, md: 8 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.1
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #FF6B35 0%, #F7931E 25%, #20B2AA 50%, #4682B4 75%, #1E90FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '-0.02em'
            }}
          >
            🏝️ Resort Amenities
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              color: '#2C5F6F',
              lineHeight: 1.6,
              fontStyle: 'italic'
            }}
          >
            Discover our range of amenities that make your stay unforgettable 🌺
          </Typography>
        </Box>

        <Stack spacing={6}>
          {filteredTypes.map((type) => {
            const count = type.count || 0;
            const typeImage = getTypeImage(type.slug);

            return (
              <AccommodationTypeCard
                key={type._id}
                type={type}
                count={count}
                typeImage={typeImage}
                onViewType={handleViewType}
              />
            );
          })}
        </Stack>

        <Box
          sx={{
            mt: 12,
            p: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.9) 50%, rgba(255, 248, 220, 0.95) 100%)',
            backdropFilter: 'blur(25px)',
            borderRadius: 6,
            border: '3px solid rgba(32, 178, 170, 0.2)',
            boxShadow: '0 15px 50px rgba(32, 178, 170, 0.2), 0 8px 25px rgba(255, 107, 53, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 25%, #20B2AA 50%, #4682B4 75%, #1E90FF 100%)'
            },
            '&::after': {
              content: '"🌴"',
              position: 'absolute',
              top: 30,
              left: 30,
              fontSize: '3rem',
              opacity: 0.05,
              transform: 'rotate(-15deg)'
            }
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 4,
              background: 'linear-gradient(45deg, #FF6B35 0%, #20B2AA 50%, #1E90FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.2rem', md: '2.8rem' }
            }}
          >
            🏖️ Explore Our Amenities
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 6,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.7,
              color: '#2C5F6F',
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontStyle: 'italic'
            }}
          >
            From relaxing pools to family-friendly play areas, find everything you need for the perfect getaway.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<EyeOutlined />}
            onClick={() => navigate('/book-now')}
            sx={{
              px: 8,
              py: 3,
              borderRadius: 50,
              background: 'linear-gradient(135deg, #20B2AA 0%, #FF6B35 50%, #1E90FF 100%)',
              fontWeight: 800,
              fontSize: '1.4rem',
              textTransform: 'capitalize',
              boxShadow: '0 8px 30px rgba(32, 178, 170, 0.4)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                transition: 'left 0.8s'
              },
              '&:hover::before': {
                left: '100%'
              },
              '&:hover': {
                background: 'linear-gradient(135deg, #FF6B35 0%, #20B2AA 50%, #4682B4 100%)',
                boxShadow: '0 12px 40px rgba(255, 107, 53, 0.5)',
                transform: 'translateY(-4px) scale(1.05)'
              }
            }}
          >
            🌊 Book Your Dream Getaway
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AmenityTypePage;