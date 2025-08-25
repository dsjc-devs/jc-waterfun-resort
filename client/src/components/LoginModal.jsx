import { Box, Dialog, Grid, Stack, Typography } from '@mui/material'
import AuthLogin from 'pages/authentication/auth-forms/AuthLogin'
import React from 'react'
import MainCard from './MainCard'

import login from 'assets/images/upload/login.png'
import LogoSection from './logo'
import { Link } from 'react-router-dom'
import IconButton from './@extended/IconButton'
import { CloseOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

const LoginModal = ({ open, handleClose, message }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
    >
      <MainCard style={{ padding: "2em", position: 'relative' }}>
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={handleClose}>
          <CloseOutlined />
        </IconButton>

        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} md={6}>
            <Stack alignItems='center' marginBlockEnd={2}>
              <LogoSection />
            </Stack>
            <Box component='img' src={login} style={{ width: "100%", objectFit: "cover" }} />
          </Grid>

          <Grid item xs={12} md={6}>
            {message && (
              <Typography
                variant="body1"
                color="secondary"
                textAlign="center"
                sx={{ mb: 2 }}
              >
                {message}
              </Typography>
            )}

            <Typography variant='h2' textAlign='center' gutterBottom>
              Login
            </Typography>

            <AuthLogin handleLogin={() => {
              handleClose()
              toast.success("You've sucessfully logged in.")
            }} isNavigateToPortal={false} />

            <Box marginBlock={2}>
              <Typography
                component={Link}
                to="/register"
                variant="body1"
                sx={{ textDecoration: 'none' }}
                color="primary"
              >
                Don&apos;t have an account?
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </MainCard>
    </Dialog>
  )
}

export default LoginModal