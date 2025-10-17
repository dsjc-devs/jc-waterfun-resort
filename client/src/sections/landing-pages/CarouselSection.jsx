import React, { useMemo } from 'react'
import Carousel from 'react-material-ui-carousel'
import banner from 'assets/images/upload/banner.jpg'
import banner2 from 'assets/images/upload/banner2.jpg'
import banner3 from 'assets/images/upload/banner3.jpg'
import banner4 from 'assets/images/upload/accom1.jpg'
import banner5 from 'assets/images/upload/accom2.jpg'
import banner6 from 'assets/images/upload/accom3.jpg'
import banner7 from 'assets/images/upload/accom4.jpg'
import banner8 from 'assets/images/upload/banner4.jpg'
import { Box } from '@mui/material'
import { useGetCarousels } from 'api/carousel'

const CarouselSection = () => {
  const defaultSlides = [
    banner,
    banner2,
    banner3,
    banner4,
    banner5,
    banner6,
    banner7,
    banner8
  ]

  const { data } = useGetCarousels({ page: 1, limit: 50 })
  const uploadedSlides = useMemo(
    () =>
      (data?.carousels || [])
        .filter((carousel) => carousel?.isPosted && carousel?.image)
        .map((carousel) => carousel.image),
    [data]
  )

  const items = uploadedSlides.length > 0 ? uploadedSlides : defaultSlides

  return (
    <Carousel
      navButtonsAlwaysVisible
      stopAutoPlayOnHover={false}
      indicators={false}
      height="100dvh"
      duration={1000}
      interval={5000}
    >
      {
        items.map((item, idx) => (
          <Box sx={{ position: "relative", height: "100dvh" }} key={idx}>
            <Box
              component="img"
              src={item}
              data-aos="fade-up"
              sx={{
                width: "100%",
                height: "100dvh",
                objectFit: "cover",
              }}
            />
            <Box
              data-aos="fade-up"
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
  )
}

export default CarouselSection