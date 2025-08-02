import React from 'react';
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { Grid, Typography, Stack, } from '@mui/material'


import address from 'layout/footer-items/address'
import quickLinks from 'layout/footer-items/quickLinks'
import  {COMPANY_NAME}  from 'constants/constants.js';


const Footer = () => {

  const theme = useTheme();
  const date = new Date();
  const currentYear = date.getFullYear();
  const navigate = useNavigate();



  return (

    <React.Fragment>
      <Grid
        container
        sx={{
          backgroundColor: theme.palette.primary.main,
          p: 3
        }}
      >
        <Grid item md={4} sm={12}>
          <Typography mb={2} variant="h4" color="#ffffff">
            Contact Information
          </Typography>
          {address.map((ad) => (
            <Stack key={ad.name} direction="row" alignItems="center" spacing={2} mb={1.5} >
              {React.createElement(ad.icon, { style: { color: ad.color, fontSize: 18 } })}
              <Typography variant="subtitle2" color="#ffffff">
                {ad.name}
              </Typography>
            </Stack>
          ))}
        </Grid>
        <Grid item md={4} sm={12}>
          <Typography mb={2} variant="h4" color="#ffffff">
            Quick Links
          </Typography>
          {quickLinks.map((ql) => (
            <Stack key={ql.name} onClick={() => navigate(ql.link)} sx={{ cursor: 'pointer', ":hover": { textDecoration: 'underline #fff' } }} direction="row" alignItems="center" spacing={2} mb={1.5} >
              {React.createElement(ql.icon, { style: { color: ql.color, fontSize: 18 } })}
              <Typography variant="subtitle2" color="#ffffff">
                {ql.name}
              </Typography>
            </Stack>
          ))}
        </Grid>

        <Grid item md={4} sm={12}>
          <Typography mb={2} variant="h4" color="#ffffff">
            Book Your Reservation Today!
          </Typography>
          <Typography mb={1} variant="subtitle2" color="#ffffff">
            Come and enjoy a relaxing stay at {COMPANY_NAME}, where the ocean views are stunning, and the atmosphere is peaceful.Whether you want to unwind or have fun by the beach, we have everything you need for a perfect getaway.Book your reservation today and make memories that will last a lifetime!
          </Typography >
        </Grid >
      </Grid >
      <Stack gap={1}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, .4)',
          bottom: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          padding: 1.5,
        }}>

        <Typography variant= 'h6' color="#ffff">©</Typography>
        <Typography variant='h6' color="#ffff" sx={{ cursor: 'pointer', ":hover": { textDecoration: 'underline' } }}>{COMPANY_NAME}, All Rights Reserved {currentYear} </Typography>
     
      </Stack>

       </React.Fragment>

  )
}

export default Footer