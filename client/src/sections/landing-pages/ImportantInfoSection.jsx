import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card
} from '@mui/material';

const ImportantInfoSection = () => {
  return (
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
  );
};

export default ImportantInfoSection;