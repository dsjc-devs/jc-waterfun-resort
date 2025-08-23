import { Stack, Typography, Drawer, IconButton, List, ListItem, ListItemText, Button, useMediaQuery } from '@mui/material'
import { MenuOutlined } from '@ant-design/icons'

import React from 'react'
import Logo from 'components/logo/LogoMain'
import navItems from '../nav-items/navItems'
import { useNavigate } from 'react-router'

const NavbarMobile = ({ handleDrawerToggle, drawerOpen }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const navigate = useNavigate()

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
              zIndex: 1,
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
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: 2,
              },
            }}
          >
            <List sx={{ width: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[{ _id: "home", name: 'Home', link: '/' }, ...navItems].map((nav) => (
                nav.name !== 'Login' ? (
                  <ListItem
                    sx={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                    }}
                    button
                    key={nav._id}
                    onClick={() => {
                      navigate(nav.link);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fff' }}>
                          {nav.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                ) : null
              ))}
            </List>
            <Stack
              sx={{
                padding: 2,
                borderTop: '1px solid #fff',
                marginTop: 'auto',
                textAlign: 'center',
              }}
            >
              <Button
                variant='contained'
                sx={{ borderRadius: 2 }}
                onClick={() => {
                  navigate('/login');
                  setDrawerOpen(false);
                }}
              >
                Login
              </Button>
            </Stack>
          </Drawer>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default NavbarMobile