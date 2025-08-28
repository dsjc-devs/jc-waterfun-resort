import React, { useEffect } from 'react'
import { Box, Fab, Tooltip, Zoom } from '@mui/material'
import { useLocation } from 'react-router'
import { KeyboardArrowUp } from '@mui/icons-material'

import Navbar from './Navbar'
import Footer from './Footer'
import ScrollTopButton from 'components/ScrollTopButton'

const Wrapper = ({ children, hasBanner }) => {
  const location = useLocation()

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
        {children}
      </Box>
      <Footer />

      <ScrollTopButton />
    </React.Fragment>
  )
}

export default Wrapper
