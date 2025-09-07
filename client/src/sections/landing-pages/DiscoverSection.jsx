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
        height: '70dvh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: { xs: 2, md: 10 },
        py: { xs: 4, md: 8 },
        overflow: 'hidden',
        backgroundImage: `url(${banner8})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(1, 4, 1, 0.45)',
          zIndex: 1,
        }}
      />
      <Box sx={{ position: 'absolute', left: { xs: 10, md: 80 }, top: { xs: 120, md: 180 }, zIndex: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
        <Box
          component="img"
          src={banner4}
          alt="Nature Adventure 1"
          sx={{
            width: { xs: '180px', md: '300px' },
            height: 'auto',
            boxShadow: 4,
            borderRadius: 2,
            transform: 'rotate(-12deg)',
            border: '6px solid #fff',
            mb: 0,
            mr: { xs: 2, md: 8 },
            position: 'relative',
            zIndex: 2,
          }}
        />
        <Box
          component="img"
          src={banner5}
          alt="Nature Adventure 2"
          sx={{
            width: { xs: '180px', md: '300px' },
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
      <Box
        sx={{
          ml: { xs: 0, md: 40 },
          color: '#fff',
          maxWidth: { xs: '100%', md: '55%' },
          zIndex: 3,
          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          pl: { xs: 0, md: 8 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 300, letterSpacing: 2, mb: 1, fontFamily: 'Cinzel, serif' }}>
          DISCOVER NATURE AT ITS FINEST
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Cinzel, serif' }}>
          MAKING IT HAPPEN!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 400, lineHeight: 1.7 }}>
          Wake up the family with a symphony of birdsong ushering in a day of discovery. Discover a multitude of colors and textures with a score of indigenous flowers, plants, and trees.<br />
          <br />
          Let your children experience the thrills of adventure in the forest. Their eyes are soon fluent in the vibrant markings of birds and insects. From the cliffs, end your day with the incredible sight of an endless sky of stars. At JC Waterfun Resort, the exhilarating outdoors is preserved for you—as nature intended.
        </Typography>
      </Box>
    </Box>
  )
}

export default DiscoverSection