import React from 'react';
import { ExpandMore } from '@mui/icons-material';
import { useGetFAQS } from 'api/faqs';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Typography,
  Container,
  Box,
  Paper,
  Divider,
  Fade
} from '@mui/material';
import Banner from 'components/Banner';
import Faqs from 'assets/images/upload/faqs-header.jpg'

const FAQS = () => {
  const { data, isLoading } = useGetFAQS({ status: 'POSTED' });
  const faqs = data?.faqs || [];

  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <React.Fragment>
      <Banner
        image={Faqs}
        title="FAQs"
        subtitle="A place to find answers"
      />

      <Box
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
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {isLoading && Array.from({ length: 3 }).map((_, idx) => (
            <Paper
              key={idx}
              elevation={6}
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 5,
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                background: 'rgba(255,255,255,0.98)'
              }}
            >
              <Skeleton variant="text" width={180} height={38} sx={{ mb: 2 }} />
              <Divider sx={{ mb: 2 }} />
              {Array.from({ length: 2 }).map((__, i) => (
                <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 2 }} />
              ))}
            </Paper>
          ))}

          {!isLoading && faqs.length > 0 && (
            Object.entries(groupedFaqs).map(([category, faqsInCategory], catIdx) => (
              <Fade in timeout={600} key={category}>
                <Paper
                  elevation={6}
                  sx={{
                    mb: 5,
                    p: { xs: 2, md: 4 },
                    borderRadius: 5,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.98)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 16px 50px rgba(0,0,0,0.2)',
                      transform: 'translateY(-6px)'
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{
                        fontSize: { xs: 22, md: 26 },
                        letterSpacing: 0.2,
                        background: 'linear-gradient(45deg, #0984e3, #07413f)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      🏖️ {category}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(0, 206, 201, 0.2)', borderWidth: 2 }} />
                  {faqsInCategory.map((faq, index) => (
                    <Paper
                      key={faq._id || index}
                      elevation={2}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease-in-out',
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
                              fontSize: 16,
                              lineHeight: 1.7,
                              fontWeight: 400
                            }}
                          >
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </Paper>
                  ))}
                </Paper>
              </Fade>
            ))
          )}

          {!isLoading && faqs.length === 0 && (
            <Container sx={{ my: 4, paddingTop: 7 }}>
              <Typography variant="h4" align="center" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                🏖️ No FAQs available at the moment. Please check back later.
              </Typography>
            </Container>
          )}
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default FAQS;
