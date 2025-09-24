import { Box, Container, Grid, Typography, useMediaQuery, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import React from 'react';

const Hero = ({
  backgroundImage = '',
  title = 'BREATH TAKING SCENIC VIEWS',
  subtitle = "DISCOVER THE COVE'S HIDDEN PARADISE",
  caption = "You know you've found a treasure trove when family encounters with nature are a tradition, and you\'ve given them wonderful memories to last a lifetime.",
  buttonConfigs
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
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
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        minHeight: isMobile ? '60vh' : '80vh',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: isMobile ? 1 : 3
        }}
      >
        <Grid container spacing={isMobile ? 2 : 4} justifyContent="center" alignItems="center">
          <Grid
            item
            xs={12}
            md={10}
            sx={{
              textAlign: 'center',
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' }
            }}
          >
            <Box
              data-aos="fade-up"
              data-aos-duration="1000"
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 1,
                maxWidth: { xs: '100%', sm: '580px' },
                mr: { xs: 0, sm: 3, md: 26 },
                ml: { xs: 0, sm: 3, md: 0 }
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'common.white',
                  mb: { xs: 1.5, md: 2 },
                  letterSpacing: '0.1em',
                  fontFamily: 'Cinzel, serif',
                  textAlign: 'center',
                }}
              >
                {subtitle}
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: 'common.white',
                  mb: { xs: 2, md: 3 },
                  fontFamily: 'Cinzel, serif',
                  lineHeight: 1.2
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'common.white',
                  mb: buttonConfigs ? 4 : 0,
                  maxWidth: '600px',
                  lineHeight: 1.8,
                  margin: '0 auto',
                  textAlign: 'center'
                }}
              >
                {caption}
              </Typography>
              {
                buttonConfigs && (
                  <Button
                    variant="contained"
                    onClick={buttonConfigs.action}
                    sx={{
                      mt: { xs: 2, md: 3 },
                      px: { xs: 0.5, md: 1 },
                      py: { xs: 0.1, md: 0.2 },
                      minWidth: 'auto',
                      height: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#2C3E50',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      fontFamily: 'Cinzel, serif',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      borderRadius: '50px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease-in-out',
                      border: '2px solid transparent',
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'common.white',
                        border: '2px solid rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                      }
                    }}
                  >
                    {buttonConfigs.label}
                  </Button>
                )
              }
            </Box >
          </Grid >
        </Grid >
      </Container >
    </Box >
  );
};

export default Hero;