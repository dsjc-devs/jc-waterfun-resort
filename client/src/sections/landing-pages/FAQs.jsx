import React, { useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container, Box, Paper, Button } from '@mui/material'
import { ExpandMore, ArrowForward } from '@mui/icons-material'
import { useGetFAQS } from 'api/faqs'
import { useNavigate } from 'react-router-dom'

import AOS from 'aos'

const FAQs = ({ limit = 4 }) => {

  const { data } = useGetFAQS({ status: 'POSTED', limit })
  const { faqs = [] } = data || {}
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [faqs]);

  return (
    <Box
      data-aos="fade-up"
      sx={{
        background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #07413f 100%)',
        py: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(0, 206, 201, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z\' fill=\'%23ffffff\'/%3E%3C/svg%3E") no-repeat center bottom',
          backgroundSize: 'cover'
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            color="white"
            sx={{
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            🏖️ Have Questions?
          </Typography>
          <Typography
            variant="h6"
            color="rgba(255,255,255,0.9)"
            sx={{
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              maxWidth: '400px',
              mx: 'auto'
            }}
          >
            Find quick answers about your perfect beach getaway
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          {faqs.map((faq, idx) => (
            <Paper
              key={idx}
              elevation={2}
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.5)',
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
                }
              }}
            >
              <Accordion
                sx={{
                  boxShadow: 'none',
                  background: 'transparent',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { margin: 0 }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: '#07413f', fontSize: '1.5rem' }} />}
                  sx={{
                    px: 3,
                    py: 2,
                    background: 'linear-gradient(45deg, rgba(116, 185, 255, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)',
                    '& .MuiAccordionSummary-content': { margin: '8px 0' }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      background: 'linear-gradient(45deg, #0984e3, #07413f)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    🌊 {faq.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    px: 3,
                    py: 2,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                    borderTop: '1px solid rgba(0, 206, 201, 0.2)'
                  }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      fontSize: '1rem',
                      fontWeight: 400
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          ))}

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/faqs')}
              sx={{
                px: 5,
                py: 2,
                borderRadius: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(255,255,255,0.4)',
                background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,0.9) 90%)',
                color: '#0984e3',
                border: '2px solid rgba(255,255,255,0.8)',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(255,255,255,0.6)',
                  transform: 'translateY(-3px)',
                  background: 'linear-gradient(45deg, #ffffff 30%, rgba(255,255,255,1) 90%)',
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              🏄‍♀️ Explore All FAQs
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default FAQs