import { Box } from '@mui/material'

import React from 'react'
import Carousel from 'react-material-ui-carousel'

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
        indicators={false}
        navButtonsAlwaysVisible
        height="100dvh"
        duration={1000}
        interval={4000}
      >
        {
          items.map((item) => (
            <Box>
              <Box
                component="img"
                src={item}
                sx={{
                  width: '100%',
                  objectFit: 'cover',
                  height: '100dvh'
                }}
              />
            </Box>
          ))
        }
      </Carousel>
    </React.Fragment>
  )
}

export default Home