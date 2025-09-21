import { Box, Container, Grid, Typography, Divider, Paper } from '@mui/material'
import { useGetResortDetails } from 'api/resort-details'

import React from 'react'
import PageTitle from 'components/PageTitle'
import Banner from 'components/Banner'
import TitleTag from 'components/TitleTag'

import AboutUS from 'assets/images/upload/about-us-header.jpg'
import FlagIcon from '@mui/icons-material/Flag'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const AboutUs = () => {
  const { resortDetails } = useGetResortDetails()
  const { aboutUs } = resortDetails || {}
  const { mission, vision, goals } = aboutUs || {}

  return (
    <React.Fragment>
      <PageTitle title="About Us" isOnportal={false} />

      <Banner
        image={AboutUS}
        title="About Us"
        subtitle="Where relaxation and fun meet unforgettable memories"
      />

      <Box sx={{
        width: "100%",
        height: 18,
        mb: 3,
        background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
        borderRadius: 8,
        opacity: 0.7
      }} />

      <Container sx={{ my: 5 }}>
        <Grid container spacing={5} justifyContent='center' alignItems="center">
          <Grid item xs={12} md={12}>
            <Paper
              data-aos="fade-up"
              elevation={6}
              sx={{
                borderRadius: 4,
                p: 4,
                mb: 2,
                background: "#f8fffa",
                boxShadow: "0 8px 32px 0 rgba(67,206,162,0.10)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ position: "absolute", top: 12, right: 18, fontSize: 32, opacity: 0.25 }}>
                🌴
              </Box>
              <TitleTag icon={<FlagIcon />} title="Our Mission" subtitle="Mission" />
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ color: "#185a9d", fontSize: { xs: "1.1rem", md: "1.25rem" }, lineHeight: 1.8, textAlign: "center", maxWidth: 700, mx: "auto", fontWeight: 500 }}>
                {mission || "No mission statement available."}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper
              data-aos="fade-up"
              data-aos-delay="150"
              elevation={6}
              sx={{
                borderRadius: 4,
                p: 4,
                mb: 2,
                background: "#f8fffa",
                boxShadow: "0 8px 32px 0 rgba(24,90,157,0.10)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ position: "absolute", top: 12, right: 18, fontSize: 32, opacity: 0.25 }}>
                🏖️
              </Box>
              <TitleTag icon={<VisibilityIcon />} title="Our Vision" subtitle="Vision" />
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ color: "#185a9d", fontSize: { xs: "1.1rem", md: "1.25rem" }, lineHeight: 1.8, textAlign: "center", maxWidth: 700, mx: "auto", fontWeight: 500 }}>
                {vision || "No vision statement available."}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper
              data-aos="fade-up"
              data-aos-delay="300"
              elevation={6}
              sx={{
                borderRadius: 4,
                p: 4,
                mb: 2,
                background: "#f8fffa",
                boxShadow: "0 8px 32px 0 rgba(67,206,162,0.10)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Box sx={{ position: "absolute", top: 12, right: 18, fontSize: 32, opacity: 0.25 }}>
                🍹
              </Box>
              <TitleTag icon={<EmojiEventsIcon />} title="Our Goals" subtitle="Goals" />
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ color: "#185a9d", fontSize: { xs: "1.1rem", md: "1.25rem" }, lineHeight: 1.8, textAlign: "center", maxWidth: 700, mx: "auto", fontWeight: 500 }}>
                {goals || "No goals statement available."}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default AboutUs