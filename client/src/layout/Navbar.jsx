import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Stack, Typography } from '@mui/material'

import navItems from './Wrapper/nav-items/navItems'
import Logo from 'assets/images/logo/logo-circular.png'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  if (isHomePage) {
    const total = navItems.length + 3
    const logoIndex = Math.floor(total / 2)

    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={6}
        sx={{
          position: 'absolute',
          top: 0,
          width: '100%',
          backgroundColor: 'transparent',
          paddingY: 2,
          px: 4,
          zIndex: 1000,
        }}
      >
        {navItems.map((nav, index) => {
          return (
            <React.Fragment key={nav._id}>
              {index === logoIndex - 1 && (
                <Stack
                  onClick={() => navigate('/')}
                  sx={{ cursor: 'pointer', alignItems: 'center' }}
                >
                  <img src={Logo} alt="Logo" style={{ height: '70px' }} />
                </Stack>
              )}
              <Typography
                variant="body2"
                onClick={() => navigate(nav.link)}
                sx={{
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}
              >
                {nav.name}
              </Typography>
            </React.Fragment>
          )
        })}
        <Button
          variant="contained"
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Stack>
    )
  }
  return (
    <Stack
      sx={{
        position: 'sticky',
        top: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingInline: 20,
        alignItems: 'center',
        zIndex: 10,
        background: 'linear-gradient(to right, rgb(31, 90, 158), rgb(46, 119, 180))',
      }}
    >
      <Stack onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
        <img src={Logo} alt="Logo" style={{ height: '70px' }} />
      </Stack>

      {navItems.map((nav) => (
        <Stack
          key={nav._id}
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={() => navigate(nav.link)}
          sx={{ paddingBlock: '3%', cursor: 'pointer' }}
        >
          {React.createElement(nav.icon, {
            style: { color: 'white', fontSize: 18 },
          })}
          <Typography variant="body2" color="#fff" sx={{ fontWeight: 'normal' }}>
            {nav.name}
          </Typography>
        </Stack>
      ))}
      <Button
        variant="contained"
        sx={{ borderRadius: 2 }}
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
    </Stack>
  )
}

export default Navbar
