import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useGetFAQS } from 'api/faqs';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Typography,
  Container
} from '@mui/material';
import Banner from 'components/Banner';

const FAQS = () => {
  const { data, isLoading } = useGetFAQS({ status: 'POSTED' });
  const faqs = data?.faqs || [];

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {});

  return (
    <React.Fragment>
      <Banner
        image="https://www.anvayacove.com/beach-nature-club/wp-content/uploads/2014/09/header_contactus1.jpg"
        title="FAQs"
        subtitle="A place to find answers"
      />
      
      {isLoading && Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" height={48} sx={{ marginBottom: 1 }} />
      ))}

      {!isLoading && faqs.length > 0 && (
        Object.entries(groupedFaqs).map(([category, faqsInCategory]) => (
          <Container key={category} sx={{ my: 3 }}>
            <Typography variant="h3" sx={{ mb: 2, textTransform: 'capitalize' }}>
              {category}
            </Typography>

            {faqsInCategory.map((faq, index) => (
              <Accordion key={faq._id || index} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<DownOutlined />}
                  aria-controls={`panel-${category}-${index}-content`}
                  id={`panel-${category}-${index}-header`}
                >
                  <Typography variant="subtitle1">{faq.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        ))
      )}

      {!isLoading && faqs.length === 0 && (
        <Container sx={{ my: 4, paddingTop: 7 }}>
          <Typography variant="h4" align="center" color="text.secondary">
            No FAQs available at the moment. Please check back later.
          </Typography>
        </Container>
      )}
    </React.Fragment>
  );
};

export default FAQS;
