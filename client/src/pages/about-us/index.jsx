import { Box, Container, Grid, Typography, Divider, Paper } from '@mui/material'
import { useGetResortDetails } from 'api/resort-details'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from 'components/PageTitle'
import Banner from 'components/Banner'

import AboutUS from 'assets/images/upload/about-us-header.jpg'
import AboutCTA from 'assets/images/upload/about-us-cta.jpg'
import FlagIcon from '@mui/icons-material/Flag'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Hero from 'sections/landing-pages/Hero'
import MapSection from 'sections/landing-pages/MapSection'
import FAQs from 'sections/landing-pages/FAQs'

const AboutUs = () => {
  const navigate = useNavigate()
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
      <Container maxWidth="lg" sx={{ my: 5 }}>
        <Grid container spacing={6} justifyContent='center' alignItems="stretch">
          <Grid item xs={12}>
            <Paper
              data-aos="fade-up-left"
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: '26px',
                overflow: "hidden",
                background: '#ffffff',
                border: '1px solid rgba(67,206,162,0.12)',
                boxShadow: '0 8px 30px -12px rgba(67,206,162,0.12)',
                transition: 'all 0.35s ease-in-out',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 60px -16px rgba(67,206,162,0.18)',
                }
              }}
            >
              {/* decorative accent circles */}
              <Box sx={{
                position: 'absolute',
                right: -80,
                top: -60,
                width: 440,
                height: 440,
                background: 'radial-gradient(circle at 30% 30%, rgba(24,90,157,0.35) 0%, rgba(24,90,157,0.08) 60%)',
                borderRadius: '50%',
                transform: 'rotate(12deg)',
                zIndex: -1,
                pointerEvents: 'none'
              }} />
              {/* new circles for Mission */}
              <Box sx={{
                position: 'absolute',
                left: -120,
                top: 40,
                width: 340,
                height: 340,
                background: 'radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.07) 80%)',
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                right: 40,
                bottom: -120,
                width: 280,
                height: 280,
                background: 'radial-gradient(circle, rgba(24,90,157,0.32) 0%, rgba(24,90,157,0.07) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                left: 180,
                bottom: -120,
                width: 220,
                height: 220,
                background: 'radial-gradient(circle, rgba(212,175,55,0.09) 0%, rgba(212,175,55,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                left: 80,
                top: -130,
                width: 240,
                height: 240,
                background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                right: -180,
                bottom: 120,
                width: 340,
                height: 340,
                background: 'radial-gradient(circle, rgba(67,206,162,0.13) 0%, rgba(67,206,162,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  position: 'relative',
                  p: { xs: 4, md: 0 },
                  mt: { xs: 0, md: '-30px' },
                  ml: { xs: 0, md: '-1px' },
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                <Box
                  sx={{
                    width: '450px',
                    height: '350px',
                    position: 'relative',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px -20px rgba(67,206,162,0.18)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(67,206,162,0.08)',
                      clipPath: 'path("M0,30 C0,13.4 13.4,0 30,0 L420,0 C436.6,0 450,13.4 450,30 L450,250 Q300,350 150,300 Q75,275 0,300 L0,30")',
                      zIndex: 1
                    },
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: 'path("M0,30 C0,13.4 13.4,0 30,0 L420,0 C436.6,0 450,13.4 450,30 L450,250 Q300,350 150,300 Q75,275 0,300 L0,30")',
                      transition: 'transform 0.35s ease-in-out',
                    },
                    '&:hover img': {
                      transform: 'scale(1.06)'
                    }
                  }}
                >
                  <img src={AboutUS} alt="Our Mission" />
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: '55%' },
                  p: { xs: 4, md: 6 },
                  backgroundColor: 'rgba(248,255,250,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <FlagIcon
                  sx={{
                    fontSize: '2rem',
                    color: '#43cea2',
                    mb: 1.5
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1.5,
                    color: '#111',
                    fontWeight: 800,
                    fontFamily: 'Cinzel, serif',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Our Mission
                </Typography>
                <Box sx={{ width: 64, height: 6, bgcolor: 'primary.main', borderRadius: 3, mb: 2, opacity: 0.95 }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: '#111',
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.8,
                    fontWeight: 600,
                    letterSpacing: '0.4px',
                    textAlign: 'center',
                    width: '100%'
                  }}
                >
                  {mission || "No mission statement available."}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              data-aos="fade-up-right"
              data-aos-delay="150"
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: '26px',
                overflow: "hidden",
                background: '#ffffff',
                border: '1px solid rgba(24,90,157,0.12)',
                boxShadow: '0 8px 30px -12px rgba(24,90,157,0.12)',
                transition: 'all 0.35s ease-in-out',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row-reverse' },
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 60px -16px rgba(24,90,157,0.18)',
                }
              }}
            >
              {/* decorative accent circles */}
              <Box sx={{
                position: 'absolute',
                left: -136,
                bottom: -104,
                width: 460,
                height: 460,
                background: 'radial-gradient(circle at 70% 70%, rgba(24,90,157,0.35) 0%, rgba(24,90,157,0.08) 60%)',
                borderRadius: '50%',
                transform: 'rotate(-8deg)',
                zIndex: -1,
                pointerEvents: 'none'
              }} />
              {/* new circles for Vision */}
              <Box sx={{
                position: 'absolute',
                right: -170,
                top: 60,
                width: 330,
                height: 330,
                background: 'radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.07) 80%)',
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                left: 80,
                bottom: -170,
                width: 260,
                height: 260,
                background: 'radial-gradient(circle, rgba(24,90,157,0.32) 0%, rgba(24,90,157,0.07) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                left: 120,
                top: -180,
                width: 260,
                height: 260,
                background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                right: -240,
                bottom: 100,
                width: 340,
                height: 340,
                background: 'radial-gradient(circle, rgba(24,90,157,0.13) 0%, rgba(24,90,157,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  position: 'relative',
                  p: { xs: 4, md: 0 },
                  mt: { xs: 0, md: '-30px' },
                  mr: { xs: 0, md: '-4px' },
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start'
                }}
              >
                <Box
                  sx={{
                    width: '450px',
                    height: '350px',
                    position: 'relative',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px -20px rgba(24,90,157,0.18)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(24,90,157,0.08)',
                      clipPath: 'path("M0,30 C0,13.4 13.4,0 30,0 L420,0 C436.6,0 450,13.4 450,30 L450,300 Q225,375 0,300 L0,30")',
                      zIndex: 1
                    },
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: 'path("M0,30 C0,13.4 13.4,0 30,0 L420,0 C436.6,0 450,13.4 450,30 L450,300 Q225,375 0,300 L0,30")',
                      transition: 'transform 0.35s ease-in-out',
                    },
                    '&:hover img': {
                      transform: 'scale(1.06)'
                    }
                  }}
                >
                  <img src={AboutCTA} alt="Our Vision" />
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: '55%' },
                  p: { xs: 4, md: 6 },
                  backgroundColor: 'rgba(248,255,250,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <VisibilityIcon
                  sx={{
                    fontSize: '2rem',
                    color: '#185a9d',
                    mb: 1.5
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1.5,
                    color: '#111',
                    fontWeight: 800,
                    fontFamily: 'Cinzel, serif',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Our Vision
                </Typography>
                <Box sx={{ width: 64, height: 6, bgcolor: 'primary.main', borderRadius: 3, mb: 2, opacity: 0.95 }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: '#111',
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.8,
                    fontWeight: 600,
                    letterSpacing: '0.4px'
                  }}
                >
                  {vision || "No vision statement available."}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              data-aos="fade-up"
              data-aos-delay="300"
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: '26px',
                overflow: "hidden",
                background: '#ffffff',
                border: '1px solid rgba(67,206,162,0.12)',
                boxShadow: '0 8px 30px -12px rgba(67,206,162,0.12)',
                transition: 'all 0.35s ease-in-out',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 60px -16px rgba(67,206,162,0.18)',
                }
              }}
            >
              {/* decorative accent circles */}
              <Box sx={{
                position: 'absolute',
                right: -120,
                bottom: -116,
                width: 420,
                height: 420,
                background: 'radial-gradient(circle at 20% 80%, rgba(24,90,157,0.35) 0%, rgba(24,90,157,0.08) 60%)',
                borderRadius: '50%',
                transform: 'rotate(4deg)',
                zIndex: -1,
                pointerEvents: 'none'
              }} />
              {/* new circles for Goals */}
              <Box sx={{
                position: 'absolute',
                left: -130,
                top: 80,
                width: 280,
                height: 280,
                background: 'radial-gradient(circle, rgba(212,175,55,0.32) 0%, rgba(212,175,55,0.07) 80%)',
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                right: 80,
                bottom: -130,
                width: 240,
                height: 240,
                background: 'radial-gradient(circle, rgba(24,90,157,0.32) 0%, rgba(24,90,157,0.07) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                left: 180,
                bottom: -120,
                width: 220,
                height: 220,
                background: 'radial-gradient(circle, rgba(212,175,55,0.09) 0%, rgba(212,175,55,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                left: 100,
                top: -140,
                width: 220,
                height: 220,
                background: 'radial-gradient(circle, rgba(212,175,55,0.13) 0%, rgba(212,175,55,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box sx={{
                position: 'absolute',
                right: -180,
                bottom: 80,
                width: 280,
                height: 280,
                background: 'radial-gradient(circle, rgba(67,206,162,0.13) 0%, rgba(67,206,162,0.01) 80%)',
                borderRadius: '50%',
                zIndex: 0,
                pointerEvents: 'none'
              }} />
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  position: 'relative',
                  p: { xs: 4, md: 0 },
                  mt: { xs: 0, md: '-30px' },
                  ml: { xs: 0, md: '-1px' },
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start'
                }}
              >
                <Box
                  sx={{
                    width: '450px',
                    height: '350px',
                    position: 'relative',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 40px -20px rgba(67,206,162,0.18)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(67,206,162,0.08)',
                      clipPath: 'path("M0,30 C0,13.4 13.4,0 30,0 L420,0 C436.6,0 450,13.4 450,30 L450,275 Q375,375 225,325 Q75,275 0,325 L0,30")',
                      zIndex: 1
                    },
                    '& img': {
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: 'path("M0,30 C0,13.4 13.4,0 30,0 L420,0 C436.6,0 450,13.4 450,30 L450,275 Q375,375 225,325 Q75,275 0,325 L0,30")',
                      transition: 'transform 0.35s ease-in-out',
                    },
                    '&:hover img': {
                      transform: 'scale(1.06)'
                    }
                  }}
                >
                  <img src={AboutUS} alt="Our Goals" />
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: '100%', md: '55%' },
                  p: { xs: 4, md: 6 },
                  backgroundColor: 'rgba(248,255,250,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <EmojiEventsIcon
                  sx={{
                    fontSize: '2rem',
                    color: '#43cea2',
                    mb: 1.5
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    mb: 1.5,
                    color: '#111',
                    fontWeight: 800,
                    fontFamily: 'Cinzel, serif',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Our Goals
                </Typography>
                <Box sx={{ width: 64, height: 6, bgcolor: 'primary.main', borderRadius: 3, mb: 2, opacity: 0.95 }} />
                <Typography
                  variant="body1"
                  sx={{
                    color: '#111',
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.8,
                    fontWeight: 600,
                    letterSpacing: '0.4px'
                  }}
                >
                  {goals || "No goals statement available."}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ mt: 8, mb: 0 }}>
        <Hero
          backgroundImage={AboutCTA}
          title="Ready to Experience Paradise?"
          subtitle="Your Perfect Getaway Awaits"
          caption="Join us at JC Waterfun Resort and create unforgettable memories with your loved ones."
          buttonConfigs={{
            label: "Resort Gallery",
            action: () => navigate('/gallery'),
            sx: {
              background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
              color: '#ffffff',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(67,206,162,0.25)',
              }
            }
          }}
        />
      </Box>

      <MapSection />
      <FAQs />
    </React.Fragment>
  )
}

export default AboutUs