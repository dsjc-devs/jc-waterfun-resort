import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Container,
} from '@mui/material';
import { useGetResortDetails } from 'api/resort-details';
import { EnvironmentFilled, MailFilled, PhoneFilled } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';

import PageTitle from 'components/PageTitle';
import MainCard from 'components/MainCard';
import Banner from 'components/Banner';
import Logo from 'components/logo/LogoMain'

const ContactUs = () => {
  const theme = useTheme()

  const { resortDetails } = useGetResortDetails()
  const { companyInfo } = resortDetails || {}
  const {
    address,
    emailAddress,
    phoneNumber,
    logo
  } = companyInfo || {}

  const {
    streetAddress,
    city,
    province,
    country
  } = address || {}

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
              <Stack alignItems='center' marginBlockEnd={2}>
                <Logo isPadded={true} />
              </Stack>
              <MainCard
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%"
                }}
              >
                <Typography variant="h4" textAlign='center' gutterBottom>Contact Information</Typography>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1} >
                    <EnvironmentFilled style={{ color: theme.palette.error.main }} />
                    <Typography variant='body'> {streetAddress}, {city} {province}, {country} </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1} >
                    <PhoneFilled style={{ color: theme.palette.primary.light }} />
                    <Typography variant='body'> {phoneNumber} </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1} >
                    <MailFilled style={{ color: theme.palette.primary.dark }} />
                    <Typography variant='body'> {emailAddress} </Typography>
                  </Stack>
                </Box>
              </MainCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default ContactUs;
