import { Box, Button, Container, Grid, Typography } from '@mui/material'
import { useGetResortDetails } from 'api/resort-details'

import React from 'react'
import TitleTag from 'components/TitleTag2'
import banner2 from 'assets/images/upload/banner2.jpg'

const AboutUs = () => {
    const { resortDetails } = useGetResortDetails()
    const { companyInfo } = resortDetails || {}

    return (
        <React.Fragment>
            <Box sx={{ backgroundColor: '#f5e7cc' }}>
                <Container sx={{ paddingBlock: 5 }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} sm={6} data-aos="fade-right">
                            <TitleTag title="About Us" />

                            <Typography
                                textAlign="center"
                                fontWeight="bold"
                                variant="h4"
                                marginBlock={5}
                                data-aos="zoom-in"
                            >
                                Dive into Fun & <br /> Create Lasting Memories
                            </Typography>

                            <Typography
                                textAlign="center"
                                fontSize={15}
                                variant="body1"
                                paddingInline="15%"
                                data-aos="fade-up"
                            >
                                Welcome to <strong>{companyInfo?.name}</strong>,
                                your perfect destination for relaxation and family fun.
                                Our resort features sparkling swimming pools, exciting
                                kiddie play areas, and spacious amenities designed to make
                                every visit refreshing and enjoyable. Whether it's a
                                weekend getaway, a family outing, or a special celebration,
                                we provide a safe and memorable experience for guests of all ages.
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#421a0c',
                                    marginTop: 5,
                                    borderRadius: 5,
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    marginBlock: 5,
                                }}
                                data-aos="fade-up"
                            >
                                View More Photos
                            </Button>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                            data-aos="fade-left"
                        >
                            <img
                                src={banner2}
                                alt="Resort view"
                                style={{
                                    width: '100%',
                                    height: '625px',
                                    aspectRatio: '16/9',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    )
}

export default AboutUs
