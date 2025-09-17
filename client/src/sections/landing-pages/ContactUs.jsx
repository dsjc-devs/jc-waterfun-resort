import { Box, Button, Container, Grid, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetResortDetails } from 'api/resort-details';

import React from 'react';
import accom from 'assets/images/upload/accom3.jpg';
import TitleTag from 'components/TitleTag2';

const ContactUsHomePage = () => {
    const navigate = useNavigate();

    const handleContactClick = () => {
        navigate('/contact-us');

    };

    const { resortDetails } = useGetResortDetails()
    const { companyInfo } = resortDetails || {}
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    return (
        <Box sx={{ backgroundColor: '#e8f5fd', py: 10, borderTop: '3px solid #5cb2c7' }}>
            <Container>
                <Grid container spacing={2} alignItems="center">
                    {!isMobile && (
                        <Grid item xs={12} md={6}>
                            <Box
                                component="img"
                                src={accom}
                                alt={companyInfo?.name || "Resort"}
                                data-aos="fade-right"
                                sx={{
                                    width: "100%",
                                    height: "625px",
                                    aspectRatio: "16/9",
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    boxShadow: 3,
                                }}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                        <Box
                            textAlign="center"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            height="100%"
                            px={2}
                            data-aos="fade-left"
                        >
                            <TitleTag title="Get In Touch" />

                            <Typography variant="h4" fontWeight={700} gutterBottom data-aos="zoom-in">
                                Make a Splash, Create Memories!
                            </Typography>

                            <Typography variant="body1" color="text.secondary" data-aos="fade-up">
                                Dive into fun and enjoy the sunshine at <br />
                                <strong>{companyInfo?.name}</strong>
                            </Typography>

                            <Typography variant="h6" mt={3} fontStyle="italic" color="primary" data-aos="fade-up">
                                “See you under the sun!” <br /> #SummerAdventure #JCWFR
                            </Typography>

                            <Box mt={6} data-aos="fade-up">
                                <Typography variant="body2" color="text.secondary">
                                    Have questions or need assistance? <br />
                                    We're here to help you.
                                </Typography>

                                <Button
                                    variant="contained"
                                    onClick={handleContactClick}
                                    sx={{
                                        mt: 3,
                                        borderRadius: 8,
                                        width: "150px",
                                    }}
                                >
                                    Contact Us
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

            </Container>
        </Box>
    );
};

export default ContactUsHomePage;
