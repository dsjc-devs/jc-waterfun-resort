import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Divider,
  Skeleton
} from '@mui/material';
import { useGetResortDetails } from 'api/resort-details';
import TitleTag2 from 'components/TitleTag2';

const ContactLocationSection = () => {
  const { resortDetails, isLoading: loading } = useGetResortDetails();
  const { companyInfo = {} } = resortDetails || {};

  return (
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
  );
};

export default ContactLocationSection;