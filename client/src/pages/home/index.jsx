import React from 'react'
import { Box, Card, CardMedia } from '@mui/material'

import Slider from 'react-slick'
import carouselItems from 'components/carousel-items/carouselItems'

const Home = () => {
  return (
    <React.Fragment>
      <Box sx={{ mt: -10 }}>
        <Slider
          className="custom-slider"
          infinite={true}
          speed={500}
          autoplay={true}
          autoplaySpeed={6000}
        >
          {carouselItems.map((item, index) => (
            <Card key={index} sx={{ borderRadius: 0 }}>
              <CardMedia
                component="img"
                image={item.link}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100dvh',
                  objectFit: 'cover',
                }}
              />
            </Card>
          ))}
        </Slider>
      </Box>
    </React.Fragment>
  )
}

export default Home
