import React from 'react'
import { Box } from '@mui/material'

import Carousel from 'components/carousel.jsx'

const Home = () => {
  return (
    <React.Fragment>
      <Box sx={{ padding: 0, margin: 0, width: '100%', height: '100%' }}>
       <Carousel/>
      </Box>
    </React.Fragment>
  )
}

export default Home