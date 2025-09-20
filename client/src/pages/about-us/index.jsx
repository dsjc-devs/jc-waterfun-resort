import React from 'react'
import { Box, Container, Grid, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useGetResortDetails } from 'api/resort-details'

import PageTitle from 'components/PageTitle'
import Banner from 'components/Banner'
import TitleTag from 'components/TitleTag'

import AboutUS from 'assets/images/upload/about-us-header.jpg'
import img1 from 'assets/images/upload/our-mission.jpg'
import img2 from 'assets/images/upload/vision.jpg'
import img3 from 'assets/images/upload/our-goals.jpg'

const AboutUs = () => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
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
        <Grid container spacing={4} sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* Mission Section */}
          <Grid item xs={12}>
            <Box
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 3, md: 6 },
                mb: { xs: 4, md: 8 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  order: { xs: 2, md: 1 },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 400 },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img1}
                    alt="Mission"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  order: { xs: 1, md: 2 },
                  background: "#181c20",
                  color: "#fff",
                  p: { xs: 4, md: 6 },
                  borderRadius: 3,
                  textAlign: "center",
                  minHeight: { xs: 300, md: 400 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TitleTag title="Our Mission" subtitle="Mission" />
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7 }}>
                  {mission || "No mission statement available."}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Vision Section */}
          <Grid item xs={12}>
            <Box
              data-aos="fade-up"
              data-aos-delay="250"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 3, md: 6 },
                mb: { xs: 4, md: 8 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  order: { xs: 1, md: 1 },
                  background: "#181c20",
                  color: "#fff",
                  p: { xs: 4, md: 6 },
                  borderRadius: 3,
                  textAlign: "center",
                  minHeight: { xs: 300, md: 400 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TitleTag title="Our Vision" subtitle="Vision" />
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7 }}>
                  {vision || "No vision statement available."}
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  order: { xs: 2, md: 2 },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 400 },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img2}
                    alt="Vision"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Goals Section */}
          <Grid item xs={12}>
            <Box
              data-aos="fade-up"
              data-aos-delay="400"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 3, md: 6 },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  order: { xs: 2, md: 1 },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 250, md: 400 },
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: 3,
                  }}
                >
                  <img
                    src={img3}
                    alt="Goals"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  order: { xs: 1, md: 2 },
                  background: "#181c20",
                  color: "#fff",
                  p: { xs: 4, md: 6 },
                  borderRadius: 3,
                  textAlign: "center",
                  minHeight: { xs: 300, md: 400 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TitleTag title="Our Goals" subtitle="Goals" />
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7 }}>
                  {goals || "No goals statement available."}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default AboutUs