import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TitleTag2 from 'components/TitleTag2';

const GroupPackagesSection = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, backgroundColor: '#f4e8cf' }}>
      <Container>
        <TitleTag2
          title="Group Packages & Events"
          subtitle="Perfect occasions to celebrate at our resort with special event hall accommodations"
        />

        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="100">
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e8f5fd 0%, #f0f9ff 100%)',
                border: '2px solid #2a93c1',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={2}>
                Team Building
              </Typography>
              <Typography variant="h6" fontWeight={900} color="#2a93c1" mb={2}>
                20+ pax
              </Typography>
              <Typography variant="body1" color="#634131" mb={3} sx={{ flexGrow: 1 }}>
                Host your company outing with organized activities, catering options, and our spacious event hall for meetings and presentations.
              </Typography>
              <Typography variant="body2" color="#2a93c1" fontWeight={600}>
                • Event hall included
              </Typography>
              <Typography variant="body2" color="#2a93c1" fontWeight={600}>
                • Catering services available
              </Typography>
              <Typography variant="body2" color="#2a93c1" fontWeight={600}>
                • Team building activities
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="200">
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fff4e6 0%, #fff9f0 100%)',
                border: '2px solid #f29023',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#f29023" mb={2}>
                Family Reunion
              </Typography>
              <Typography variant="h6" fontWeight={900} color="#f29023" mb={2}>
                15+ pax
              </Typography>
              <Typography variant="body1" color="#634131" mb={3} sx={{ flexGrow: 1 }}>
                Celebrate with extended family using our comfortable event hall with flexible seating and intimate dining arrangements.
              </Typography>
              <Typography variant="body2" color="#f29023" fontWeight={600}>
                • Flexible seating arrangements
              </Typography>
              <Typography variant="body2" color="#f29023" fontWeight={600}>
                • Family-style dining options
              </Typography>
              <Typography variant="body2" color="#f29023" fontWeight={600}>
                • Group discount available
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="300">
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f5f0e8 0%, #f8f5f0 100%)',
                border: '2px solid #634131',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#634131" mb={2}>
                Birthday Parties
              </Typography>
              <Typography variant="h6" fontWeight={900} color="#634131" mb={2}>
                10+ pax
              </Typography>
              <Typography variant="body1" color="#634131" mb={3} sx={{ flexGrow: 1 }}>
                Make birthdays memorable in our event hall with decorations, party packages, and celebration amenities.
              </Typography>
              <Typography variant="body2" color="#634131" fontWeight={600}>
                • Decoration services
              </Typography>
              <Typography variant="body2" color="#634131" fontWeight={600}>
                • Birthday party packages
              </Typography>
              <Typography variant="body2" color="#634131" fontWeight={600}>
                • Audio/visual equipment
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Single Event Hall CTA */}
        <Box sx={{ mt: 6, textAlign: 'center' }} data-aos="fade-up" data-aos-delay="400">
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2a93c1 0%, #f29023 100%)',
              color: 'white',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="h4" fontWeight={700} fontFamily="Poppins" mb={2}>
              Event Hall Accommodations
            </Typography>
            <Typography variant="h6" fontFamily="Poppins" mb={3} opacity={0.9}>
              All group events can be enhanced with our premium event hall facilities
            </Typography>
            <Typography variant="body1" fontFamily="Poppins" mb={4} opacity={0.8}>
              Spacious venue • Professional setup • Audio/visual equipment • Flexible arrangements
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/accommodations?type=event_hall')}
              sx={{
                backgroundColor: 'white',
                color: '#2a93c1',
                fontWeight: 700,
                fontFamily: 'Poppins',
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore Event Hall Options
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default GroupPackagesSection;