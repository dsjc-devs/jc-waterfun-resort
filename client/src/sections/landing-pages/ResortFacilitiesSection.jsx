import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card
} from '@mui/material';
import TitleTag2 from 'components/TitleTag2';

const ResortFacilitiesSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#f4e8cf' }}>
      <Container>
        <TitleTag2
          title="Resort Facilities"
          subtitle="Comprehensive amenities for the perfect getaway"
        />

        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="100">
            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={2}>
                Swimming Areas
              </Typography>
              <Typography variant="body2" color="#634131" mb={2}>
                • Adult-sized swimming pool
              </Typography>
              <Typography variant="body2" color="#634131" mb={2}>
                • Kids pool with safety features
              </Typography>
              <Typography variant="body2" color="#634131" mb={2}>
                • Adult pool with jacuzzi
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="200">
            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography
                variant="h6"
                fontWeight={700}
                fontFamily="Poppins"
                color="#f29023"
                mb={2}
              >
                Water Activities
              </Typography>

              <Typography variant="body2" color="#634131" mb={1}>
                • Kiddie water slides
              </Typography>
              <Typography variant="body2" color="#634131" mb={1}>
                • Poolside lounging & cabanas
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="300">
            <Card sx={{ p: 3, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#634131" mb={2}>
                Amenities & Services
              </Typography>
              <Typography variant="body2" color="#634131" mb={2}>
                • Changing rooms & lockers
              </Typography>
              <Typography variant="body2" color="#634131" mb={2}>
                • Food & beverage outlets
              </Typography>
              <Typography variant="body2" color="#634131" mb={2}>
                • First aid station
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResortFacilitiesSection;