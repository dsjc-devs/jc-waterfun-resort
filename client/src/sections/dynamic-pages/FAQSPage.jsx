import React from 'react'

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Skeleton,
    Typography,
    Container,
    Box
} from '@mui/material'
import { DownOutlined } from '@ant-design/icons'
import { useGetFAQS } from 'api/faqs'
import Banner from 'components/Banner'

const FAQS = () => {
    const { data, isLoading } = useGetFAQS()
    const faqs = data?.faqs || []

    return (
        <React.Fragment>
            <Box sx={{ mt: -15 }}>
                <Banner
                    image="https://www.anvayacove.com/beach-nature-club/wp-content/uploads/2014/09/header_contactus1.jpg"
                    title="FAQs"
                    subtitle="A place to find answers"
                />
            </Box>

            {isLoading && Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} variant='rectangular' height={48} sx={{ marginBottom: 1 }} />
            ))}

            {!isLoading && faqs.length > 0 && faqs.map((faq, index) => (
                <Container key={index} sx={{ my: 2 }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<DownOutlined />}
                            aria-controls={`panel${index}-content`}
                            id={`panel${index}-header`}
                        >
                            <Typography variant="subtitle1">{faq.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>
            ))}

            {!isLoading && faqs.length === 0 && (
                <Container sx={{ my: 4, paddingTop: 7 }}>
                    <Typography variant="h4" align="center" color="text.secondary">
                        No FAQs available at the moment. Please check back later.
                    </Typography>
                </Container>
            )}
        </React.Fragment>
    )
}

export default FAQS
