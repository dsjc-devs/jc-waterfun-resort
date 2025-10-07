import React, { useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import { ArrowRightOutlined, HomeOutlined, BankOutlined, ShopOutlined, TableOutlined } from '@ant-design/icons';
import TitleTag from 'components/TitleTag2';
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetAccommodationTypes } from 'api/accomodation-type';
import { useGetAccommodations } from 'api/accommodations';
import textFormatter from 'utils/textFormatter';

const AccommodationSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { accomodationTypes, isLoading: typesLoading } = useGetAccommodationTypes();
  const { data: accommodationsData, isLoading: accommodationsLoading } = useGetAccommodations({ limit: 1000 });

  const filteredTypes = accomodationTypes?.filter(type =>
    type.slug !== 'no_category' && type.count > 0
  ) || [];

  // Dynamic grid sizing based on number of items
  const getGridSize = () => {
    const itemCount = filteredTypes.length;
    if (itemCount <= 2) return { xs: 12, sm: 6, md: 6 };
    if (itemCount === 3) return { xs: 12, sm: 6, md: 4 };
    if (itemCount === 4) return { xs: 12, sm: 6, md: 3 };
    if (itemCount === 5) return { xs: 12, sm: 6, md: 2.4 };
    return { xs: 12, sm: 6, md: 2 }; // 6 or more items
  };

  const gridSize = getGridSize();

  const getTypeImage = (slug) => {
    if (!accommodationsData?.accommodations) return null;
    const accommodation = accommodationsData.accommodations.find(acc => acc.type === slug);
    return accommodation?.thumbnail || null;
  };

  const getTypeIcon = (slug) => {
    switch (slug) {
      case 'cottage': return <HomeOutlined />;
      case 'event_hall': return <BankOutlined />;
      case 'room': return <ShopOutlined />;
      case 'table': return <TableOutlined />;
      default: return <HomeOutlined />;
    }
  };

  const handleViewType = (slug) => {
    navigate(`/accommodations?type=${slug}`);
  };

  const handleViewAll = () => {
    navigate('/accommodations');
  };



  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}
          data-aos="fade-up"
        >
          <TitleTag title="🌊 Explore All Our Accommodations" />
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
            From cozy cottages to spacious event halls, find the perfect accommodation that suits your needs and budget
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            justifyContent="center"
            alignItems="center"
            data-aos="fade-up"
            data-aos-delay="300"
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
            >
              View All Accommodations
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default AccommodationSection;