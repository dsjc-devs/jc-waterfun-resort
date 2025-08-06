import React from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AimOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons'

import PageTitle from 'components/PageTitle'
import Banner from 'components/Banner'
import TitleTag from 'components/TitleTag'

const AboutUs = () => {

  const theme = useTheme()

  return (
    <React.Fragment>
      <PageTitle title="About Us" isOnportal={false} />

      <Box sx={{ mt: -15 }}>
        <Banner
          image="https://www.anvayacove.com/beach-nature-club/wp-content/uploads/2014/09/header_contactus1.jpg"
          title="About Us"
          subtitle="Where relaxation and fun meet unforgettable memories"
        />

        <Container sx={{ my: 5 }}>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
          >
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <TitleTag
                  title="Our Mission"
                  subtitle="What We Stand For"
                  icon={
                    <AimOutlined
                      style={{ fontSize: '2rem', color: theme.palette.error.main, marginBottom: 20 }}
                    />
                  }
                />
              </Box>
              <Box mt={7}>
                <Typography variant="body1" color="text.secondary" textAlign="justify">
                  At JC Waterfun Resort, our mission is to provide a fun and safe environment for families to enjoy water activities and create lasting memories. We are committed to excellence in service and ensuring the highest standards of safety and enjoyment for all our guests.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <TitleTag
                  title="Our Team"
                  subtitle="Meet Our Experts"
                  icon={
                    <TeamOutlined
                      style={{ fontSize: '2rem', color: theme.palette.primary.light, marginBottom: 20 }}
                    />
                  }
                />
              </Box>
              <Box mt={7}>
                <Typography variant="body1" color="text.secondary" textAlign="justify">
                  Our team is composed of dedicated professionals who are passionate about water sports and customer service. Each member brings unique skills and experiences, ensuring that your visit is both enjoyable and memorable.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <TitleTag
                  title="Our Values"
                  subtitle="What Drives Us"
                  icon={
                    <HeartOutlined
                      style={{ fontSize: '2rem', color: theme.palette.error.light, marginBottom: 20 }}
                    />
                  }
                />
              </Box>
              <Box mt={7}>
                <Typography variant="body1" color="text.secondary" textAlign="justify">
                  We believe in integrity, respect, and teamwork. Our values guide us in providing exceptional service and creating a welcoming atmosphere for all our guests. We strive to foster a community where everyone feels valued and appreciated.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  )
}

export default AboutUs
