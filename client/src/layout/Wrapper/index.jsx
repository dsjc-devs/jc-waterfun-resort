import React, { useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { useLocation } from 'react-router'

import Navbar from './Navbar'
import Footer from './Footer'
import ScrollTopButton from 'components/ScrollTopButton'

const Wrapper = ({ children, hasBanner }) => {
  const location = useLocation()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname])

  return (
    <React.Fragment>
      <Navbar hasBanner={hasBanner} />
      <Box sx={{ minHeight: '80dvh', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ marginTop: isMobile && -20 }}>
          {children}
        </Box>
      </Box>
      <Footer />

      <ScrollTopButton />
    </React.Fragment >
  )
}

export default Wrapper
