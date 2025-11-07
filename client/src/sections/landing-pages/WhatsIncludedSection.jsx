import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip
} from '@mui/material';
import { StarFilled } from '@ant-design/icons';
import TitleTag2 from 'components/TitleTag2';

const WhatsIncludedSection = () => {
  return (
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
  );
};

export default WhatsIncludedSection;