import {
  Stack,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  useMediaQuery,
  Collapse,
  Divider
} from '@mui/material'
import { MenuOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router'
import { useGetAccommodationTypes } from 'api/accomodation-type'
import React, { useState } from 'react'

import Logo from 'components/logo/LogoMain'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import navItems, { getDropdownNavItems } from './nav-items/navItems'
import useAuth from 'hooks/useAuth'

const NavbarMobile = ({ handleDrawerToggle, drawerOpen }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn } = useAuth()

  const { accomodationTypes, isLoading } = useGetAccommodationTypes()
  const [openSection, setOpenSection] = useState(null)

  const handleToggleSection = (title) => {
    setOpenSection(openSection === title ? null : title)
  }

  const handleNavigation = (link) => {
    navigate(link)
    handleDrawerToggle() // Close drawer after navigation
  }

  // Get unified navigation items
  const dropdownNavItems = getDropdownNavItems(accomodationTypes)

  return (
    <React.Fragment>
      {isMobile && (
        <React.Fragment>
          <Stack
            sx={{
              position: 'sticky',
              top: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 999,
              paddingInline: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            <Stack onClick={() => navigate('/')} sx={{ cursor: 'pointer', py: 2 }}>
              <Logo />
            </Stack>
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
              <MenuOutlined />
            </IconButton>
          </Stack>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 2,
                width: 280,
              },
            }}
          >
            <List sx={{ width: '100%' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.link
                return (
                  <ListItem
                    key={item._id}
                    button
                    onClick={() => handleNavigation(item.link)}
                    sx={{
                      color: isActive ? '#1976d2' : '#fff',
                      backgroundColor: isActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontFamily: "'Cinzel', sans-serif",
                        fontWeight: isActive ? 600 : 400
                      }}
                    />
                  </ListItem>
                )
              })}

              <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

              {dropdownNavItems.map((item) => (
                <React.Fragment key={item.title}>
                  <ListItem
                    button
                    onClick={() => item.sublinks ? handleToggleSection(item.title) : handleNavigation(item.link)}
                    sx={{
                      color: '#fff',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontFamily: "'Cinzel', sans-serif",
                        fontWeight: 500
                      }}
                    />
                    {item.sublinks ? (
                      openSection === item.title ? <ExpandLess /> : <ExpandMore />
                    ) : null}
                  </ListItem>

                  {item.sublinks && (
                    <Collapse in={openSection === item.title} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.sublinks.map((sub) => (
                          <ListItem
                            key={sub.title}
                            button
                            sx={{
                              pl: 4,
                              color: '#ddd',
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)'
                              }
                            }}
                            onClick={() => handleNavigation(sub.link)}
                          >
                            <ListItemText
                              primary={sub.title}
                              primaryTypographyProps={{
                                fontSize: '0.85rem'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              ))}
            </List>

            <Stack
              sx={{
                padding: 2,
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                marginTop: 'auto',
                textAlign: 'center',
              }}
            >
              <Button
                variant='contained'
                sx={{
                  borderRadius: 2,
                  fontFamily: "'Cinzel', sans-serif",
                  fontWeight: 500
                }}
                onClick={() => handleNavigation('/login')}
              >
                {isLoggedIn ? "Portal" : "Login"}
              </Button>
            </Stack>
          </Drawer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default NavbarMobile
