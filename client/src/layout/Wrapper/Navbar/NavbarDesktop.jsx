import React from 'react'
import { Stack, Typography, Button, Container, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import Logo from 'components/logo/LogoMain'
import useAuth from 'hooks/useAuth'
import useMediaQuery from '@mui/material/useMediaQuery'
import navItems from './nav-items/navItems'

const NavbarDesktop = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))

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
                }}
              >
                {isLoggedIn ? "Portal" : "Login"}
              </Button>
            </Stack>
          </Container>
        </Box>
      )}
    </React.Fragment>
  )
}

export default NavbarDesktop