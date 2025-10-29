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
import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useGetCarousels } from 'api/carousel'

const CarouselSection = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))

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

  // Responsive height calculation
  const getCarouselHeight = () => {
    if (isMobile) return '50vh' // Reduced height for mobile
    if (isTablet) return '75vh' // Medium height for tablet
    return '100vh' // Full height for desktop
  }

  const carouselHeight = getCarouselHeight()

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: carouselHeight,
        overflow: 'hidden',
        '& .MuiCarousel-root': {
          height: '100%',
        },
        '& .MuiCarousel-indicators': {
          display: 'none',
        },
        // Custom navigation button styles
        '& .MuiCarousel-navButtons': {
          opacity: isMobile ? 0.7 : 1,
          '&:hover': {
            opacity: 1,
          },
        },
        '& .MuiCarousel-navButtonsWrapperLeft': {
          left: isMobile ? '8px' : '16px',
        },
        '& .MuiCarousel-navButtonsWrapperRight': {
          right: isMobile ? '8px' : '16px',
        },
        '& .MuiCarousel-navButton': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: isMobile ? '40px' : '50px',
          height: isMobile ? '40px' : '50px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          '& svg': {
            fontSize: isMobile ? '20px' : '24px',
            color: 'white',
          },
        },
      }}
    >
      <Carousel
        navButtonsAlwaysVisible
        stopAutoPlayOnHover={!isMobile}
        indicators={false}
        height={carouselHeight}
        duration={1000}
        interval={isMobile ? 4000 : 5000}
        animation="slide"
        cycleNavigation={true}
        swipe={true}
        navButtonsProps={{
          style: {
            borderRadius: '50%',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }
        }}
      >
        {items.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              position: "relative",
              height: carouselHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={item}
              alt={`Carousel slide ${idx + 1}`}
              loading={idx === 0 ? "eager" : "lazy"} // Optimize loading
              data-aos="fade-up"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: isMobile ? 'none' : 'scale(1.05)',
                },
              }}
            />
            {/* Enhanced overlay with gradient */}
            <Box
              data-aos="fade-up"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: isMobile
                  ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.4) 100%)'
                  : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 100%)',
                pointerEvents: 'none',
              }}
            />
          </Box>
        ))}
      </Carousel>
    </Box>
  )
}

export default CarouselSection