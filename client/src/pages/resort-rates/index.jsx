import {
  Grid,
  Typography,
  Box,
  Skeleton,
  Container,
  Card,
  Divider,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { StarFilled } from '@ant-design/icons';
import { useGetResortRates } from 'api/resort-rates';
import { useNavigate } from 'react-router-dom';

import React from 'react';
import TitleTag2 from 'components/TitleTag2';
import RateSection from 'sections/landing-pages/RateSection';
import { useGetResortDetails } from 'api/resort-details';
import FAQs from 'sections/landing-pages/FAQs';
import MapSection from 'sections/landing-pages/MapSection';

const ResortRates = () => {
  const { isLoading } = useGetResortRates();
  const { resortDetails, isLoading: loading } = useGetResortDetails()
  const { companyInfo = {} } = resortDetails || {}
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <Box sx={{ backgroundColor: '#f4e8cf', paddingBlock: 8 }}>
        <Container>
          <Box textAlign="center" marginBlock={2}>
            {isLoading && (
              <Skeleton variant="rectangular" width={400} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
            )}

            {!isLoading && (
              <RateSection isDisplayLearnMore={false} />
            )}
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container>
          <TitleTag2
            title="What's Included"
            subtitle="Discover the amazing amenities and experiences awaiting you"
          />

          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #e8f5fd 0%, #f0f9ff 100%)',
                  border: '2px solid #2a93c1',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <StarFilled style={{ color: '#f29023', fontSize: 24, marginRight: 8 }} />
                  <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#2a93c1">
                    Premium Facilities
                  </Typography>
                </Box>
                <Typography variant="body1" color="#634131" mb={2} sx={{ flexGrow: 1 }}>
                  Multiple pools, water slides, and recreational areas for the whole family.
                </Typography>
                <Chip label="Day Tour: 7AM-5PM | Night Tour: 7PM-5AM" color="primary" />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} data-aos="fade-left">
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #fff4e6 0%, #fff9f0 100%)',
                  border: '2px solid #f29023',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <StarFilled style={{ color: '#2a93c1', fontSize: 24, marginRight: 8 }} />
                  <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#f29023">
                    Safety & Comfort
                  </Typography>
                </Box>
                <Typography variant="body1" color="#634131" mb={2} sx={{ flexGrow: 1 }}>
                  Professional lifeguards, clean facilities, and comfortable amenities for your peace of mind.
                </Typography>
                <Chip label="24/7 Safety monitoring" sx={{ backgroundColor: '#f29023', color: 'white' }} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

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

      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container>
          <TitleTag2
            title="Booking & Payment Information"
            subtitle="Everything you need to know about reservations"
          />

          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Card sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={3}>
                  How to Book
                </Typography>
                <Box mb={2}>
                  <Typography variant="body1" fontWeight={600} color="#634131" mb={1}>
                    1. Online Reservation
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={2}>
                    Book through our website for instant confirmation.
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body1" fontWeight={600} color="#634131" mb={1}>
                    2. Phone Booking
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={2}>
                    Call our contact number for assistance and group bookings.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={600} color="#634131" mb={1}>
                    3. Walk-in
                  </Typography>
                  <Typography variant="body2" color="#634131">
                    Subject to availability. Advance booking recommended.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} data-aos="fade-left">
              <Card sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#f29023" mb={3}>
                  Payment Options
                </Typography>
                <Box mb={2}>
                  <Typography variant="body1" fontWeight={600} color="#634131" mb={1}>
                    Accepted Methods
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={1}>
                    • GCash
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={1}>
                    • Maya (PayMaya)
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={1}>
                    • Cash payments (at the resort)
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={3}>
                    • Online banking transfers (at the resort)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={600} color="#634131" mb={1}>
                    Payment Terms
                  </Typography>
                  <Typography variant="body2" color="#634131" mb={1}>
                    • Full payment required before entering the resort.
                  </Typography>
                  <Typography variant="body2" color="#634131">
                    • No additional fees for online payments
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

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

      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container>
          <TitleTag2
            title="Contact & Location"
            subtitle="Get in touch with us for bookings and inquiries"
          />

          <Grid container spacing={4} mt={4}>
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Card sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={3}>
                  Reservation Hotline
                </Typography>
                <Box mb={3}>
                  {loading ? (
                    <Skeleton variant="text" width="60%" height={40} />
                  ) : (
                    <Typography variant="h5" fontWeight={900} fontFamily="Poppins" color="#f29023" mb={1}>
                      {companyInfo.phoneNumber || '09171224128'}
                    </Typography>
                  )}
                  <Typography variant="body2" color="#634131">
                    Open daily: 7:00 AM - 8:00 PM
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={2}>
                  Email Inquiries
                </Typography>
                {loading ? (
                  <Skeleton variant="text" width="80%" height={25} />
                ) : (
                  <Typography variant="body1" color="#634131" mb={1}>
                    {companyInfo.emailAddress || 'johncezar.waterfun@gmail.com'}
                  </Typography>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={6} data-aos="fade-left">
              <Card sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={3}>
                  Resort Address
                </Typography>
                {loading ? (
                  <>
                    <Skeleton variant="text" width="90%" height={25} />
                    <Skeleton variant="text" width="70%" height={25} />
                    <Skeleton variant="text" width="60%" height={25} />
                  </>
                ) : (
                  <>
                    <Typography variant="body1" color="#634131" mb={2}>
                      {companyInfo.address?.streetAddress || 'R5 Brgy. Langkaan Valle Verde'}
                    </Typography>
                    <Typography variant="body1" color="#634131" mb={2}>
                      {companyInfo.address?.city || 'Dasmarinas'}, {companyInfo.address?.province || 'Cavite'}
                    </Typography>
                    <Typography variant="body1" color="#634131" mb={3}>
                      {companyInfo.address?.country || 'Philippines'}
                    </Typography>
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#2a93c1" mb={2}>
                  Operating Hours
                </Typography>
                <Typography variant="body2" color="#634131" mb={1}>
                  <strong>Day Tour:</strong> 7:00 AM - 5:00 PM
                </Typography>
                <Typography variant="body2" color="#634131" mb={1}>
                  <strong>Night Tour:</strong> 7:00 PM - 5:00 AM
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 6, backgroundColor: '#f4e8cf' }}>
        <Container>
          <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" fontWeight={700} fontFamily="Poppins" color="#634131" mb={3}>
              Important Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="#634131" mb={1}>
                  • Children under 2 years old enter for FREE
                </Typography>
                <Typography variant="body1" color="#634131" mb={1}>
                  • Day tour: 7:00 AM - 5:00 PM
                </Typography>
                <Typography variant="body1" color="#634131" mb={1}>
                  • Night tour: 7:00 PM - 5:00 AM
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="#634131" mb={1}>
                  • Valid ID required for PWD/Senior discounts
                </Typography>
                <Typography variant="body1" color="#634131" mb={1}>
                  • Rates are subject to change without prior notice
                </Typography>
                <Typography variant="body1" color="#634131" mb={1}>
                  • Payments must be completed to confirm your reservation
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      <MapSection />
      <FAQs />
    </React.Fragment>
  );
};

export default ResortRates;