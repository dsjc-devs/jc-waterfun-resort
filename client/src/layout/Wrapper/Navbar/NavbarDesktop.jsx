import React, { useEffect, useState } from 'react'
import { Stack, Container, Box, Link, Button, Typography, Grid, Popper, Paper } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetAccommodationTypes } from 'api/accomodation-type'
import { useGetAmenityTypes } from 'api/amenity-type'
import navItems, { getDropdownNavItems } from './nav-items/navItems'

import useAuth from 'hooks/useAuth'
import LogoSection from 'components/logo'
import AnimateButton from 'components/@extended/AnimateButton'
import PreviewCard from 'components/PreviewCard'

import accom1 from 'assets/images/upload/accom1.jpg'
import accom2 from 'assets/images/upload/accom2.jpg'
import accom3 from 'assets/images/upload/accom3.jpg'
import accom4 from 'assets/images/upload/accom4.jpg'

const NavbarDesktop = ({ hasBanner = true }) => {
  const { accomodationTypes, isLoading } = useGetAccommodationTypes()
  const { amenityTypes, isLoading: amenityLoading } = useGetAmenityTypes()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [open, setOpen] = useState(false)

  let timer = null

  const handleEnter = (event, item) => {
    clearTimeout(timer)
    setAnchorEl(event.currentTarget)
    setHoveredItem(item)
    setOpen(true)
  }

  const handleLeave = () => {
    timer = setTimeout(() => {
      setOpen(false)
      setAnchorEl(null)
      setHoveredItem(null)
    }, 50)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dropdownNavItems = getDropdownNavItems({ accomodationTypes, amenityTypes })

  const backgroundImages = [accom1, accom2, accom3, accom4]
  const enhancedDropdownItems = dropdownNavItems.map((item, index) => ({
    ...item,
    backgroundImage: backgroundImages[index] || accom1
  }))

  return (
    <Box sx={{ position: hasBanner ? 'absolute' : 'relative', width: '100%' }}>
      <Box
        sx={{
          position: scrolled ? 'fixed' : 'relative',
          top: hasBanner && !scrolled ? 20 : 0,
          width: '100%',
          minHeight: '80px',
          zIndex: 20,
          backgroundColor: hasBanner ? 'rgba(0, 0, 0, 0.5)' : `rgba(0, 75, 128, .8)`,
        }}
      >
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <LogoSection to='/' />
            <Stack direction="row" alignItems='center' spacing={5}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.link
                return (
                  <Link
                    key={item._id}
                    onClick={() => item.link && navigate(item.link)}
                    sx={{
                      borderTop: isActive ? "3px solid" : "3px solid transparent",
                      fontFamily: "'Cinzel', sans-serif",
                      borderColor: isActive ? (theme) => theme.palette.secondary.contrastText : "transparent",
                      paddingTop: .5,
                      color: (theme) => theme.palette.secondary.contrastText,
                      fontWeight: 500,
                      '&:hover': {
                        cursor: 'pointer',
                        color: (theme) => theme.palette.primary.main,
                      },
                    }}
                  >
                    {item.name}
                  </Link>
                )
              })}

              <AnimateButton>
                <Button
                  variant='contained'
                  size='small'
                  onClick={() => navigate('/login')}
                >
                  {isLoggedIn ? "Portal" : "Login"}
                </Button>
              </AnimateButton>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box
        sx={{
          position: 'relative',
          top: hasBanner ? 20 : 0,
          width: '100%',
          py: 2,
          minHeight: "57px !important",
          zIndex: 20,
          backgroundColor: hasBanner ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 75, 128, 1)',
        }}
      >
        <Container>
          <Grid container textAlign="center" spacing={2}>
            {enhancedDropdownItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <Box
                  onMouseLeave={handleLeave}
                  sx={{
                    cursor: "pointer",
                    borderRight: {
                      xs: "none",
                      md: index !== enhancedDropdownItems.length - 1 ? "2px solid #fff" : "none"
                    },
                    borderBottom: {
                      xs: index !== enhancedDropdownItems.length - 1 ? "1px solid rgba(255,255,255,0.3)" : "none",
                      md: "none"
                    },
                    pr: { xs: 0, md: 3 },
                    pb: { xs: 2, md: 0 },
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <Typography
                    onMouseEnter={(e) => handleEnter(e, item)}
                    onClick={() => navigate(item.link)}
                    sx={{
                      fontFamily: "Cinzel",
                      fontWeight: "normal",
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      color: (theme) => theme.palette.secondary.contrastText,
                      transition: ".3s",
                      "&:hover": { opacity: 0.4 }
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Cinzel",
                      fontWeight: "700",
                      fontSize: { xs: "75%", md: "85%" },
                      color: (theme) => theme.palette.secondary.contrastText,
                      opacity: 0.8,
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        disablePortal={false}
        modifiers={[
          { name: "zIndex", enabled: true, phase: "write", fn: ({ state }) => { state.styles.popper.zIndex = 2000 } }
        ]}
        onMouseEnter={() => clearTimeout(timer)}
        onMouseLeave={handleLeave}
      >
        <Paper sx={{ p: 1, borderRadius: .5, my: 2 }}>
          {hoveredItem && (
            <PreviewCard
              item={hoveredItem}
              backgroundImage={hoveredItem.backgroundImage}
              sublinks={hoveredItem.sublinks}
              isLoading={isLoading}
            />
          )}
        </Paper>
      </Popper>
    </Box>
  )
}

export default NavbarDesktop