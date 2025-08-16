import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import MainCard from './MainCard'
import PropTypes from 'prop-types'

const FormWrapper = ({ children, title, caption }) => {
  return (
    <MainCard>
      <Box marginBottom={2}>
        <Typography variant='h3'>
          {title}
        </Typography>
        <Typography variant='body' color='secondary'>
          {caption}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {children}
    </MainCard>
  )
}

FormWrapper.proptypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
}

export default FormWrapper