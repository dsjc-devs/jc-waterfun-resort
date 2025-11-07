import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card
} from '@mui/material';
import TitleTag2 from 'components/TitleTag2';

const BookingPaymentSection = () => {
  return (
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
  );
};

export default BookingPaymentSection;