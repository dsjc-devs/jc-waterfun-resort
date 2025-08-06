import { Box, Dialog, Stack, Tooltip, Typography } from '@mui/material'
import AuthRegister from 'pages/authentication/auth-forms/AuthRegister'
import React from 'react'
import IconButton from './@extended/IconButton'
import { CloseOutlined } from '@ant-design/icons'

const RegistrationModal = ({ open, handleClose, title = "Customer Signup", type = "CUSTOMER" }) => {
  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={open}
      onClose={handleClose}
    >
      <Stack direction='row' justifyContent='flex-end'>
        <Tooltip title="Close">
          <IconButton color="default" onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Tooltip>
      </Stack>
      <Box sx={{ p: 2 }} >
        <Typography variant='h3' textAlign='center' marginBlock={2}>
          {title}
        </Typography>
        <Box>
          <AuthRegister
            type={type}
            isFromRegister={false}
            handleClose={handleClose}
          />
        </Box>
      </Box>
    </Dialog>
  )
}

export default RegistrationModal