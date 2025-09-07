import { Box } from '@mui/material'

import React from 'react'
import Carousel from 'react-material-ui-carousel'
import RateSection from 'sections/landing-pages/RateSection'

import banner from 'assets/images/upload/banner.jpg'
import banner2 from 'assets/images/upload/banner2.jpg'
import banner3 from 'assets/images/upload/banner3.jpg'
import banner4 from 'assets/images/upload/accom1.jpg'
import banner5 from 'assets/images/upload/accom2.jpg'
import banner6 from 'assets/images/upload/accom3.jpg'
import banner7 from 'assets/images/upload/accom4.jpg'
import banner8 from 'assets/images/upload/banner4.jpg'

import AboutUs from 'sections/landing-pages/AboutUs'
import ContactUs from 'sections/landing-pages/ContactUs'

const Home = () => {
  const items = [
    banner,
    banner2,
    banner3,
    banner4,
    banner5,
    banner6,
    banner7,
    banner8
  ]

  return (
    <React.Fragment>
      <Carousel
        navButtonsAlwaysVisible
        stopAutoPlayOnHover={false}
        indicators={false}
        height="100dvh"
        duration={1000}
        interval={5000}
      >
        {
          items.map((item) => (
            <Box sx={{ position: "relative", height: "100dvh" }}>
              <Box
                component="img"
                src={item}
                sx={{
                  width: "100%",
                  height: "100dvh",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
              />
            </Box>

          ))
        }
      </Carousel>

      <RateSection />
      <ContactUs />
      <AboutUs />

      <Box
        sx={{
          width: '100%',
          minHeight: { xs: '400px', md: '520px' },
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
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(60,120,40,0.45)',
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
          <Box sx={{ fontSize: { xs: '1.3rem', md: '2.3rem' }, fontWeight: 300, letterSpacing: 2, mb: 1, fontFamily: 'Cinzel, serif' }}>
            DISCOVER NATURE AT ITS FINEST
          </Box>
          <Box sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' }, fontWeight: 700, mb: 2, fontFamily: 'Cinzel, serif' }}>
            MAKING IT HAPPEN!
          </Box>
          <Box sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' }, mb: 2, fontWeight: 400, lineHeight: 1.7 }}>
            Wake up the family with a symphony of birdsong ushering in a day of discovery. Discover a multitude of colors and textures with a score of indigenous flowers, plants, and trees.<br />
            <br />
            Let your children experience the thrills of adventure in the forest. Their eyes are soon fluent in the vibrant markings of birds and insects. From the cliffs, end your day with the incredible sight of an endless sky of stars. At JC Waterfun Resort, the exhilarating outdoors is preserved for you—as nature intended.
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default Home