import { Box, Container, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

const Hero = ({ 
  backgroundImage = '',
  title = 'BREATH TAKING SCENIC VIEWS',
  subtitle = "DISCOVER THE COVE'S HIDDEN PARADISE",
  caption = "You know you've found a treasure trove when family encounters with nature are a tradition, and you\'ve given them wonderful memories to last a lifetime."
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', 
          zIndex: 1
        },
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={10} sx={{ textAlign: 'center', display: 'flex', justifyContent: 'flex-end' }}>
            <Box 
              data-aos="fade-up"
              data-aos-duration="1000"
              sx={{
                p: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 1,
                maxWidth: '580px',
                mr: { xs: 0, md: 26
                 }
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'common.white',
                  mb: 2,
                  letterSpacing: '0.1em',
                  fontFamily: 'Cinzel, serif',
                  textAlign: 'center'
                }}
              >
                {subtitle}
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  color: 'common.white',
                  fontWeight: 700,
                  mb: 3,
                  fontSize: isMobile ? '1rem' : '2rem',
                  fontFamily: 'Cinzel, serif'
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'common.white',
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.8,
                  margin: '0 auto',
                  textAlign: 'center'
                }}
              >
                {caption}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;