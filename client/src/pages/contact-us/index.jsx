import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Container
} from '@mui/material';

import logo from 'assets/images/logo/logo.png'

import PageTitle from 'components/PageTitle';
import MainCard from 'components/MainCard';
import Banner from 'components/Banner';
import address from 'layout/Wrapper/footer-items/address';

const ContactUs = () => {
  return (
    <React.Fragment>
      <PageTitle title="Contact Us" isOnportal={false} />

      <Box sx={{ mt: -15 }}>
        <Banner
          image={"https://www.anvayacove.com/beach-nature-club/wp-content/uploads/2014/09/header_contactus1.jpg"}
          title='Contact Us'
          subtitle='We are always willing to serve'
        />
        <Container sx={{ my: 5 }}>
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2">
                If you have any questions, feel free to reach out to us!
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Feel free to contact us, and we'll do our best to provide the information or support your needs.
                Your satisfaction is our priority, and we look forward to addressing any queries you may have.
                Thank you for choosing us!
              </Typography>

              <Box component="form" sx={{ mt: 5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="firstName"
                      placeholder="First Name"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="lastName"
                      placeholder="Last Name"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      placeholder="Email Address"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="mobile"
                      placeholder="Mobile Number"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="subject"
                      placeholder="Subject"
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="message"
                      placeholder="Message"
                      required
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <img src={logo} alt="logo" style={{ maxWidth: '45%', height: 'auto' }} />
              </Box>
              <MainCard
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%"
                }}
              >
                <Typography variant="h4" textAlign='center' gutterBottom>Contact Information</Typography>
                {address.map((ad, index) => (
                  <Stack key={ad.name} direction="row" alignItems="center" spacing={2} mb={1.5}>
                    {React.createElement(ad.icon, {
                      style: {
                        color: index === 0 ? ad.color : '#000000',
                        fontSize: 18
                      }
                    })}
                    <Typography variant="subtitle2">
                      {ad.name}
                    </Typography>
                  </Stack>
                ))}
              </MainCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default ContactUs;
