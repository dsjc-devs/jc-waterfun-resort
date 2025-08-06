import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import Footer from 'layout/Footer'
import Navbar from 'layout/Navbar'
import { useLocation } from 'react-router'

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