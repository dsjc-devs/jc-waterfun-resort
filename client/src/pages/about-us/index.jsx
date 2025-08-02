import React from 'react'
import PageTitle from 'components/PageTitle'
import { Box, Grid, Typography } from '@mui/material'
import TitleTag from 'components/TitleTag'
import { UserOutlined } from '@ant-design/icons'

const AboutUs = () => {
  return (
    <React.Fragment>
      <PageTitle title="About Us" isOnportal={false} />
      <Box px={10} py={4}>
        <TitleTag title="About Us" />
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="flex-start"
          mt={2}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Box textAlign="center">
              <TitleTag
                title="Our Mission"
                subtitle="What We Stand For"
                icon={
                  <UserOutlined
                    style={{ fontSize: '2rem', color: '#1976d2', marginBottom: 20 }}
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
                  <UserOutlined
                    style={{ fontSize: '2rem', color: '#1976d2', marginBottom: 20 }}
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
                  <UserOutlined
                    style={{ fontSize: '2rem', color: '#1976d2', marginBottom: 20 }}
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
      </Box>
    </React.Fragment>
  )
}

export default AboutUs
