import { Box } from '@mui/material'
import Footer from 'layout/Footer'
import Navbar from 'layout/Navbar'
import React from 'react'

const Wrapper = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <Box sx={{ minHeight: '100dvh' }} >{children}</Box>
      <Footer />
    </React.Fragment>
  )
}

export default Wrapper