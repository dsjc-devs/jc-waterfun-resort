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
    </React.Fragment>
  )
}

export default Home