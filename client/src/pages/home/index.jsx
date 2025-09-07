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
    banner7
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
          position: 'relative',
          width: '100%',
          minHeight: { xs: '350px', md: '500px', lg: '600px' },
          backgroundImage: `url(${banner8})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(34, 85, 34, 0.45)',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: { xs: '5%', md: '8%' },
            top: { xs: '10%', md: '15%' },
            zIndex: 2,
            color: '#fff',
            textAlign: 'right',
            maxWidth: { xs: '90%', md: '50%' },
            px: { xs: 2, md: 8 },
          }}
        >
          <Box sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, fontWeight: 300, mb: 1, letterSpacing: 2 }}>
            DISCOVER NATURE AT IT'S FINEST
          </Box>
          <Box sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 700, mb: 2, letterSpacing: 1 }}>
            MAKING IT HAPPEN!
          </Box>
          <Box sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, fontWeight: 400, mb: 2 }}>
            Wake up the family with a symphony of birdsong ushering in a day of discovery. Discover a multitude of colors and textures with a score of indigenous flowers, plants, and trees.<br /><br />
            Let your children experience the thrills of adventure in the forest. Their eyes are soon fluent in the vibrant markings of birds and insects. From the cliffs, end your day with the incredible sight of an endless sky of stars. At JC Waterfun Resort, the exhilarating outdoors is preserved for you—as nature intended.
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            left: { xs: '5%', md: '10%' },
            bottom: { xs: '10%', md: '15%' },
            zIndex: 3,
            display: 'flex',
            gap: 3,
          }}
        >
          <Box
            component="img"
            src={banner4}
            alt="Nature activity"
            sx={{
              width: { xs: 140, md: 220 },
              height: { xs: 110, md: 170 },
              objectFit: 'cover',
              border: '8px solid #fff',
              boxShadow: 3,
              transform: 'rotate(-10deg)',
            }}
          />
          <Box
            component="img"
            src={banner5}
            alt="Nature activity"
            sx={{
              width: { xs: 140, md: 220 },
              height: { xs: 110, md: 170 },
              objectFit: 'cover',
              border: '8px solid #fff',
              boxShadow: 3,
              transform: 'rotate(8deg)',
            }}
          />
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default Home