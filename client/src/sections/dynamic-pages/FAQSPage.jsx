import React from 'react';
import { DownOutlined } from '@ant-design/icons';
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

      <Container maxWidth="md" sx={{ py: 2 }}>
        {isLoading && Array.from({ length: 3 }).map((_, idx) => (
          <Paper
            key={idx}
            elevation={2}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 4,
              boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
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
                elevation={2}
                sx={{
                  mb: 5,
                  p: { xs: 2, md: 4 },
                  borderRadius: 4,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  bgcolor: 'background.paper',
                  transition: 'box-shadow 0.2s'
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ fontSize: { xs: 22, md: 26 }, letterSpacing: 0.2 }}
                  >
                    {category}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2, borderColor: 'grey.200' }} />
                {faqsInCategory.map((faq, index) => (
                  <Accordion
                    key={faq._id || index}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: '1px solid #eee',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': {
                        bgcolor: 'grey.50'
                      }
                    }}
                    TransitionProps={{ unmountOnExit: true }}
                  >
                    <AccordionSummary
                      expandIcon={<DownOutlined />}
                      aria-controls={`panel-${category}-${index}-content`}
                      id={`panel-${category}-${index}-header`}
                      sx={{
                        px: 2,
                        py: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        '& .MuiAccordionSummary-content': {
                          fontWeight: 600,
                          color: 'text.primary'
                        }
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} color="text.primary">{faq.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, py: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="body1" color="text.secondary" sx={{ fontSize: 16, lineHeight: 1.7 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Paper>
            </Fade>
          ))
        )}

        {!isLoading && faqs.length === 0 && (
          <Container sx={{ my: 4, paddingTop: 7 }}>
            <Typography variant="h4" align="center" color="text.secondary">
              No FAQs available at the moment. Please check back later.
            </Typography>
          </Container>
        )}
      </Container>
    </React.Fragment>
  );
};

export default FAQS;
