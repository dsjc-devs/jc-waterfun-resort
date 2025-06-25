import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Stack, Typography } from '@mui/material'


import navItems from './Wrapper/nav-items/navItems'
import Logo from 'assets/images/logo/logo-circular.png'

const Navbar = () => {
  const navigate = useNavigate()
 

  return (
    <React.Fragment>
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
          background: 'linear-gradient(to right, rgb(31, 90, 158), rgb(46, 119, 180))'
        }}
      >
        <Stack
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          <img src={Logo} alt="Logo" style={{ height: '70px' }} />
        </Stack>

        {navItems.map((nav) => (

          <React.Fragment key={nav._id}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              onClick={() => navigate(nav.link)}
              sx={{ paddingBlock: '3%', cursor: 'pointer' }}
            >
              
              {React.createElement(nav.icon, { style: { color: 'white', fontSize: 18 } })}
              <Typography
                variant="body2"
                color="#fff"
                sx={{ fontWeight: 'normal' }}
              >
                {nav.name}
              </Typography>
            </Stack>
          </React.Fragment>
        ))}

        <Button
          variant="contained"
          sx={{ borderRadius: 2 }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Stack>
    </React.Fragment>
  )
}

export default Navbar
