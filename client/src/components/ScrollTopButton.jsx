import { Fab, Tooltip, Zoom } from '@mui/material'
import { KeyboardArrowUp } from '@mui/icons-material'

import React, { useEffect, useState } from 'react'

const ScrollTopButton = () => {
  const [showScroll, setShowScroll] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setShowScroll(true)
      } else {
        setShowScroll(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Tooltip title="Scroll top">
      <Zoom in={showScroll}>
        <Fab
          color="primary"
          size="small"
          onClick={handleScrollTop}
          sx={{
            position: 'fixed',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1200,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>
    </Tooltip>
  )
}

export default ScrollTopButton