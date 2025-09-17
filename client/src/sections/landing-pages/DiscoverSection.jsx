import { Box, Typography } from '@mui/material'
import React from 'react'
import banner4 from 'assets/images/upload/accom1.jpg'
import banner5 from 'assets/images/upload/accom2.jpg'
import banner8 from 'assets/images/upload/banner4.jpg'

const DiscoverSection = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 'auto', md: '70dvh' },
        height: { xs: 'auto', md: '70dvh' },
        position: 'relative',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: { xs: 'flex-start', md: 'flex-end' },
        px: { xs: 1, md: 10 },
        py: { xs: 4, md: 8 },
        overflow: 'hidden',
        backgroundImage: `url(${banner8})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(10, 20, 30, 0.55)',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: { xs: 'relative', md: 'absolute' },
          left: { xs: 0, md: 80 },
          top: { xs: 0, md: 180 },
          zIndex: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: { xs: 'center', md: 'flex-start' },
          mb: { xs: 2, md: 0 },
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <Box data-aos="fade-up">
          <Box
            component="img"
            src={banner4}
            alt="Nature Adventure 1"
            sx={{
              width: { xs: '120px', sm: '160px', md: '300px' },
              height: 'auto',
              boxShadow: 4,
              borderRadius: 2,
              transform: 'rotate(-12deg)',
              border: '6px solid #fff',
              mb: 0,
              mr: { xs: 1, sm: 2, md: 8 },
              position: 'relative',
              zIndex: 2,
            }}
          />
        </Box>
        <Box data-aos="fade-down">
          <Box
            component="img"
            src={banner5}
            alt="Nature Adventure 2"
            sx={{
              width: { xs: '120px', sm: '160px', md: '300px' },
              height: 'auto',
              boxShadow: 4,
              borderRadius: 2,
              transform: 'rotate(7deg)',
              border: '6px solid #fff',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          ml: { xs: 0, md: 40 },
          color: '#fff',
          maxWidth: { xs: '100%', sm: '95%', md: '55%' },
          zIndex: 3,
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
          pl: { xs: 0, md: 8 },
          mt: { xs: 2, md: 0 },
          position: 'relative',
        }}
      >
        <Typography
          variant="h6"
          data-aos="fade-right"
          sx={{
            fontWeight: 300,
            letterSpacing: 2,
            mb: 1,
            fontFamily: 'Cinzel, serif',
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.25rem' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          DISCOVER NATURE AT ITS FINEST
        </Typography>
        <Typography
          variant="h4"
          data-aos="zoom-in"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontFamily: 'Cinzel, serif',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          MAKING IT HAPPEN!
        </Typography>
        <Typography
          variant="body1"
          data-aos="fade-left"
          sx={{
            mb: 2,
            fontWeight: 400,
            lineHeight: 1.7,
            fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.1rem' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Wake up the family with a symphony of birdsong ushering in a day of discovery. Discover a multitude of colors and textures with a score of indigenous flowers, plants, and trees.<br />
          <br />
          Let your children experience the thrills of adventure in the forest. Their eyes are soon fluent in the vibrant markings of birds and insects. From the cliffs, end your day with the incredible sight of an endless sky of stars. At JC Waterfun Resort, the exhilarating outdoors is preserved for you—as nature intended.
        </Typography>
      </Box>
    </Box>
  )
}

export default DiscoverSection