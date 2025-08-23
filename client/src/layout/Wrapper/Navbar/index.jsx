import React, { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'

const Navbar = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState)
  };


  if (!isMobile) {
    return <NavbarDesktop />
  } else {
    return <NavbarMobile drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
  }
}

export default Navbar