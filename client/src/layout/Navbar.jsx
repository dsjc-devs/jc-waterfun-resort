import React, { useState } from 'react'
import { Stack, Typography, Drawer, IconButton, List, ListItem, ListItemText, Button, Container, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'

// assets
import navItems from './Wrapper/nav-items/navItems'
import { MenuOutlined } from '@ant-design/icons'
import { useGetResortDetails } from 'api/resort-details'
import Logo from 'components/logo/LogoMain'

const Navbar = () => {
  const { resortDetails } = useGetResortDetails()
  const { companyInfo } = resortDetails || {}
  const { logo } = companyInfo || {}

  const navigate = useNavigate()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState)
  };

  const middleIndex = Math.ceil(navItems.length / 2);
  const firstHalf = navItems.slice(0, middleIndex);
  const secondHalf = navItems.slice(middleIndex);

  return (
    <React.Fragment>
      {!isMobile && (
        <Box
          sx={{
            position: 'sticky',
            top: 1,
            width: '100%',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          <Container>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              {firstHalf.map((nav) => (
                <Stack
                  key={nav._id}
                  onClick={() => navigate(nav.link)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="body2" color="#fff" sx={{ fontWeight: 'bold' }}>
                    {nav.name}
                  </Typography>
                </Stack>
              ))}

              <Stack onClick={() => navigate('/')} sx={{ cursor: 'pointer', mx: 2 }}>
                <Logo />
              </Stack>

              {secondHalf.map((nav) => (
                <Stack
                  key={nav._id}
                  onClick={() => navigate(nav.link)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant="body2" color="#fff" sx={{ fontWeight: 'bold' }}>
                    {nav.name}
                  </Typography>
                </Stack>
              ))}

              <Button
                variant="contained"
                sx={{ borderRadius: 2, marginLeft: 'auto' }}
                onClick={() => {
                  navigate('/login');
                  setDrawerOpen?.(false);
                }}
              >
                Login
              </Button>
            </Stack>
          </Container>
        </Box>
      )}

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
            anchor="left"
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
  );
};

export default Navbar;
