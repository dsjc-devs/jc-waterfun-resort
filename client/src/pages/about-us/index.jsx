import React from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AimOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons'

import PageTitle from 'components/PageTitle'
import Banner from 'components/Banner'
import TitleTag from 'components/TitleTag'
import { useGetResortDetails } from 'api/resort-details'
import AboutUS from 'assets/images/upload/about-us-header.jpg'

const AboutUs = () => {
  const theme = useTheme()

  const { resortDetails } = useGetResortDetails()
  const { aboutUs } = resortDetails || {}

  const {
    mission,
    vision,
    goals
  } = aboutUs || {}

  return (
    <React.Fragment>
      <PageTitle title="About Us" isOnportal={false} />

      <React.Fragment>
        <Banner
          image={AboutUS}
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
                  {mission}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <TitleTag
                  title="Vision"
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
                  {vision}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box textAlign="center">
                <TitleTag
                  title="Our Goals"
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
                  {goals}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </React.Fragment>
  )
}

export default AboutUs
