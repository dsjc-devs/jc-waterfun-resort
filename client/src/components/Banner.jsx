import React from 'react';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';

const Banner = ({ image = '', title = '', subtitle = '' }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '50dvh',
        overflow: 'hidden',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          zIndex: 1,
        },
      }}
    >
      <Container
        sx={{
          position: 'absolute',
          bottom: isMobile ? 40 : 50,
          left: 0,
          right: 0,
          color: '#fff',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Typography
            variant="h2"
            fontFamily="Cinzel"
            sx={{ fontWeight: 300, fontSize: '3em' }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            fontFamily="Cinzel"
            sx={{ opacity: 0.9 }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
