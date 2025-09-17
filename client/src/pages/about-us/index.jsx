import React from 'react'
import { Box, Container, Grid, Typography, useMediaQuery } from '@mui/material'
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
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          direction="column"
          sx={{ maxWidth: 900, mx: "auto" }}
        >
          <Grid item xs={12} sm={10} md={8}>
            <Box
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                position: "relative",
                background: "#181c20",
                color: "#fff",
                borderRadius: 0,
                boxShadow: "none",
                minHeight: { xs: 400, md: 520 },
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 6 },
                width: { xs: "100%", md: "203%" },
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
                <TitleTag
                  title="Our Mission"
                  subtitle="Mission"
                />
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7, mb: 3, maxWidth: 540 }}>
                  {mission || "No mission statement available."}
                </Typography>
              </Box>
              {isDesktop && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 75,
                    left: -400,
                    width: 600,
                    height: 400,
                    zIndex: 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: 4,
                    background: "#fff",
                  }}
                >
                  <img
                    src={img1}
                    alt="Mission"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <Box
              data-aos="fade-up"
              data-aos-delay="250"
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
                ml: { xs: 0, md: -65 },
                width: { xs: "100%", md: "150%" },
                overflow: "visible",
              }}
            >
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
                  ml: { xs: 4, md: 20 },
                }}
              >
                <TitleTag
                  title="Our Vision"
                  subtitle="Vision"
                />
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7, mb: 3 }}>
                  {vision || "No vision statement available."}
                </Typography>
              </Box>
              {isDesktop && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 75,
                    right: -400,
                    width: 600,
                    height: 400,
                    zIndex: 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: 4,
                    background: "#fff",
                  }}
                >
                  <img
                    src={img2}
                    alt="Vision"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={10} md={8}>
            <Box
              data-aos="fade-up"
              data-aos-delay="400"
              sx={{
                position: "relative",
                background: "#181c20",
                color: "#fff",
                borderRadius: 0,
                boxShadow: "none",
                minHeight: { xs: 400, md: 520 },
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 6 },
                width: { xs: "100%", md: "203%" },
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
                <TitleTag
                  title="Our Goals"
                  subtitle="Goals"
                />
                <Typography variant="body1" sx={{ color: "#cfd8dc", lineHeight: 1.7, mb: 3, maxWidth: 540 }}>
                  {goals || "No goals statement available."}
                </Typography>
              </Box>

              {isDesktop && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 75,
                    left: -400,
                    width: 600,
                    height: 400,
                    zIndex: 3,
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: 4,
                    background: "#fff",
                  }}
                >
                  <img
                    src={img3}
                    alt="Goals"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default AboutUs