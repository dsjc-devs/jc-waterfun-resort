import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useLocation } from 'react-router'

import Navbar from './Navbar'
import Footer from './Footer'

const Wrapper = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname])

  return (
    <React.Fragment>
      <Navbar />
      <Box sx={{ minHeight: '80dvh' }} >{children}</Box>
      <Footer />
    </React.Fragment>
  )
}

export default Wrapper