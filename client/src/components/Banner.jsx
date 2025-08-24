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
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <Container
        sx={{
          position: 'absolute',
          bottom: isMobile ? 40 : 50,
          left: 0,
          right: 0,
          color: '#fff',
        }}
      >
        <Box
          sx={{
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Typography variant="h2" fontFamily="Cinzel" sx={{ fontWeight: 300, fontSize: '3em' }}>
            {title}
          </Typography>
          <Typography variant="h5"  fontFamily="Cinzel" sx={{ opacity: 0.75 }}>
            {subtitle}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
