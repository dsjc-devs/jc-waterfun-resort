import React from 'react'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AimOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons'

import PageTitle from 'components/PageTitle'
import Banner from 'components/Banner'
import TitleTag from 'components/TitleTag'
import { useGetResortDetails } from 'api/resort-details'
import AboutUS from 'assets/images/upload/about-us-header.jpg'
import img1 from 'assets/images/upload/our-mission.jpg'
import img2 from 'assets/images/upload/vision.jpg'
import img3 from 'assets/images/upload/our-goals.jpg' 

const sections = [
  {
    title: "APPROACH TO SUCCESS",
    subtitle: "Our Unique",
    description:
      "Forge Apollo has a powerful team of innovators, storytellers, and problem solvers. Our unique approach combines the creativity of an award-winning video production team with the strategy of digital marketing gurus. As experts in website design, SEO, branding, email marketing, HubSpot, social media marketing, PPC, video marketing, and more, we craft comprehensive strategies to keep our clients ahead of the competition. Whether your business is B2B, B2C, or in the medical, tourism, or another industry, we can help you drive brand awareness, lead generation, and more revenue. Forge Apollo can help you stop fighting for your audience’s attention by creating scroll-stopping content that they’ll want to pay attention to.",
    highlight: "WE'RE YOUR BRAND'S UNFAIR ADVANTAGE.",
    image: img1,
  },
  {
    title: "APPROACH TO SUCCESS",
    subtitle: "Our Unique",
    description:
      "Forge Apollo has a powerful team of innovators, storytellers, and problem solvers. Our unique approach combines the creativity of an award-winning video production team with the strategy of digital marketing gurus. As experts in website design, SEO, branding, email marketing, HubSpot, social media marketing, PPC, video marketing, and more, we craft comprehensive strategies to keep our clients ahead of the competition. Whether your business is B2B, B2C, or in the medical, tourism, or another industry, we can help you drive brand awareness, lead generation, and more revenue. Forge Apollo can help you stop fighting for your audience’s attention by creating scroll-stopping content that they’ll want to pay attention to.",
    highlight: "WE'RE YOUR BRAND'S UNFAIR ADVANTAGE.",
    image: img2,
    rotate: true,
  },
  {
    title: "APPROACH TO SUCCESS",
    subtitle: "Our Unique",
    description:
      "Forge Apollo has a powerful team of innovators, storytellers, and problem solvers. Our unique approach combines the creativity of an award-winning video production team with the strategy of digital marketing gurus. As experts in website design, SEO, branding, email marketing, HubSpot, social media marketing, PPC, video marketing, and more, we craft comprehensive strategies to keep our clients ahead of the competition. Whether your business is B2B, B2C, or in the medical, tourism, or another industry, we can help you drive brand awareness, lead generation, and more revenue. Forge Apollo can help you stop fighting for your audience’s attention by creating scroll-stopping content that they’ll want to pay attention to.",
    highlight: "WE'RE YOUR BRAND'S UNFAIR ADVANTAGE.",
    image: img3,
  },
];

const AboutUs = () => {
  const theme = useTheme()
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

      <Container sx={{ my: 5 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          direction="column"
          sx={{ maxWidth: 900, mx: "auto" }}
        >
          {/* Section 1 */}
          <Grid item xs={12} sm={10} md={8}>
            <Box
              sx={{
                position: "relative",
                background: "#181c20",
                color: "#fff",
                borderRadius: 0,
                boxShadow: "none",
                minHeight: { xs: 400, md: 520 },
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 6 },
                width: { xs: "500%", md: "203%" }, // <-- stretch wider on desktop
                maxWidth: { xs: "100%", md: "none" },
                display: "flex",
                flexDirection: { xs: "column", md: "row-reverse" },
                alignItems: "stretch",
                overflow: "visible",
                ml: { xs: 0, md: -8 }, 
              }}
            >
              {/* Text Block - left side */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                  pr: { xs: 0, md: 8 },
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" sx={{ color: "#6ec6ff", mb: 1, fontWeight: 500 }}>
                  {sections[0].subtitle}
                </Typography>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: -1 }}>
                  {sections[0].title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7, mb: 3, maxWidth: 540 }}>
                  {sections[0].description}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", mt: 2 }}>
                  {sections[0].highlight}
                </Typography>
              </Box>
              {/* Overlapping Image - right side */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 105, md: 75 },
                  left: { xs: 0, md: -400 },
                  width: { xs: 360, md: 600 },
                  height: { xs: 240, md: 400 },
                  zIndex: 3,
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: 4,
                  background: "#fff",
                }}
              >
                <img
                  src={sections[0].image}
                  alt="Approach to Success"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          </Grid>
          {/* Section 2 (rotated) */}
            <Grid item xs={12} sm={10} md={8}>
  <Box
      sx={{
        position: "relative",
        background: "#181c20",
        color: "#fff",
        borderRadius: 0,
        boxShadow: "none",
        minHeight: { xs: 400, md: 520 },
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ml: { xs: 0, md: -65 }, // Move box to the left on desktop
        width: { xs: "100%", md: "150%" }, // smaller width
        overflow: "visible",
      }}
  >
    {/* Text Block */}
    <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            zIndex: 2,
            maxWidth: { xs: "100%", md: "60%" },
            ml: { xs: 4, md: 20 }, // Move text further to the right
          }}
    >
      <Typography variant="subtitle1" sx={{ color: "#6ec6ff", mb: 1, fontWeight: 500 }}>
        {sections[1].subtitle}
      </Typography>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: -1 }}>
        {sections[1].title}
      </Typography>
      <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7, mb: 3 }}>
        {sections[1].description}
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", mt: 2 }}>
        {sections[1].highlight}
      </Typography>
    </Box>

    {/* Overlapping Image (absolute, like first section) */}
    <Box
        sx={{
                    position: "absolute",
                    top: { xs: 105, md: 75 },
                    right: { xs: 0, md: -400 },
                    width: { xs: 360, md: 600 },
                    height: { xs: 240, md: 400 },
                    zIndex: 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: 4,
                    background: "#fff",
                  }}
    >
      <img
        src={sections[1].image}
        alt="Vision"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>
  </Box>
</Grid>

            <Grid item xs={12} sm={10} md={8}>
              <Box
                sx={{
                  position: "relative",
                  background: "#181c20",
                  color: "#fff",
                  borderRadius: 0,
                  boxShadow: "none",
                  minHeight: { xs: 400, md: 520 },
                  py: { xs: 6, md: 10 },
                  px: { xs: 2, md: 6 },
                  width: { xs: "500%", md: "203%" },
                  maxWidth: { xs: "100%", md: "none" },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row-reverse" },
                  alignItems: "stretch",
                  overflow: "visible",
                  ml: { xs: 0, md: -8 },
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2,
                    pr: { xs: 0, md: 8 },
                    textAlign: "center",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "#6ec6ff", mb: 1, fontWeight: 500 }}>
                    {sections[2].subtitle}
                  </Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ mb: 2, letterSpacing: -1 }}>
                    {sections[2].title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7, mb: 3, maxWidth: 540 }}>
                    {sections[2].description}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#fff", mt: 2 }}>
                    {sections[2].highlight}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 105, md: 75 },
                    left: { xs: 0, md: -400 },
                    width: { xs: 360, md: 600 },
                    height: { xs: 240, md: 400 },
                    zIndex: 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: 4,
                    background: "#fff",
                  }}
                >
                  <img
                    src={sections[2].image}
                    alt="Our Goals"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default AboutUs