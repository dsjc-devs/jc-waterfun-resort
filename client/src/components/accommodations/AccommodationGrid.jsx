import { ArrowRightOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Box, Grid, Typography, Chip, Stack, Button, Container, Card, CardContent, Fade } from '@mui/material'
import { Link } from 'react-router-dom'
import { icons } from 'menu-items/modules'

import AnimateButton from 'components/@extended/AnimateButton'
import LabeledValue from 'components/LabeledValue'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
import formatPeso from 'utils/formatPrice'
import textFormatter from 'utils/textFormatter'

const AccommodationGrid = ({ accomData = {}, index = 0 }) => {
  const isOdd = index % 2 !== 0

  const {
    _id,
    name,
    description,
    thumbnail,
    price,
    capacity,
    maxStayDuration,
    pictures = [],
    type
  } = accomData || {}

  const _type = textFormatter.fromSlug(type)

  return (
    <Box sx={{
      py: { xs: 2, sm: 3, md: 6, lg: 8 },
      bgcolor: isOdd ? '#f8f9fa' : '#fff',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isOdd
          ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(25, 118, 210, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 240, 240, 0.3) 100%)',
        zIndex: 0
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: { xs: 0, sm: 1, md: 2 } }}>
        <Fade in timeout={800}>
          <Grid container alignItems="center" spacing={0}>
            <Grid
              item
              xs={12}
              md={6}
              order={{ xs: 1, md: isOdd ? 2 : 1 }}
              sx={{
                p: 0,
                minHeight: { xs: 'auto', md: '500px' }
              }}
            >
              <Box
                position="relative"
                sx={{
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  minHeight: { xs: 250, sm: 300, md: '100%' }
                }}
              >
                <Chip
                  color="primary"
                  label={_type}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: { xs: 8, sm: 12, md: 16 },
                    left: { xs: 8, sm: 12, md: 16 },
                    zIndex: 2,
                    fontWeight: 'bold',
                    px: { xs: 0.75, sm: 1, md: 2 },
                    borderRadius: { xs: 3, md: 6 },
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(25, 118, 210, 0.9)',
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.75rem' }
                  }}
                />
                <Carousel
                  autoPlay={false}
                  duration={700}
                  animation="slide"
                  navButtonsAlwaysVisible={true}
                  indicators={false}
                  navButtonsProps={{
                    style: {
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      color: '#1976d2',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: window.innerWidth < 600 ? 'none' : 'flex'
                    }
                  }}
                  indicatorIconButtonProps={{
                    style: {
                      color: 'rgba(255,255,255,0.6)',
                      margin: '0 2px',
                      padding: '4px'
                    }
                  }}
                  activeIndicatorIconButtonProps={{
                    style: {
                      color: '#fff'
                    }
                  }}
                  sx={{
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    '& .MuiBox-root': {
                      height: '100%'
                    }
                  }}
                >
                  {[thumbnail, ...pictures].map((item, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={item.image || item}
                      alt={name}
                      sx={{
                        width: '100%',
                        height: { xs: 250, sm: 300, md: 400, lg: 500, xl: 600 },
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        margin: 0,
                        padding: 0,
                        transition: 'transform 0.6s ease',
                        '&:hover': {
                          transform: { xs: 'none', md: 'scale(1.02)' }
                        }
                      }}
                    />
                  ))}
                </Carousel>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              order={{ xs: 2, md: isOdd ? 1 : 2 }}
              sx={{
                p: { xs: 2, sm: 3, md: 4, lg: 6 },
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Stack spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ width: '100%' }}>
                <Box>
                  <Typography
                    variant="h3"
                    fontFamily="Cinzel"
                    sx={{
                      mb: { xs: 0.5, sm: 1, md: 2 },
                      fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.6rem', lg: '2rem', xl: '2.5rem' },
                      fontWeight: 'bold',
                      color: 'text.primary',
                      lineHeight: { xs: 1.1, md: 1.2 }
                    }}
                  >
                    {name}
                  </Typography>

                  <Card
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: { xs: 1, sm: 1.5, md: 2 },
                      borderRadius: { xs: 1.5, md: 3 },
                      boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)'
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      textAlign="center"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '1rem', lg: '1.25rem' },
                        lineHeight: 1.2
                      }}
                    >
                      Day: {formatPeso(price?.day)} | Night: {formatPeso(price?.night)}
                    </Typography>
                  </Card>
                </Box>

                <Typography
                  variant="body1"
                  fontFamily="Istok Web"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.95rem', lg: '1.1rem' },
                    lineHeight: { xs: 1.5, md: 1.7 },
                    color: 'text.secondary'
                  }}
                >
                  {description}
                </Typography>

                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{
                      p: { xs: 1, sm: 1.5, md: 2 },
                      bgcolor: 'grey.50',
                      borderRadius: { xs: 1, md: 2 },
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}>
                      <LabeledValue
                        icon={<icons.AccountGroupIcon style={{ color: '#1976d2', fontSize: '1.2rem' }} />}
                        title="Guest Capacity"
                        subTitle={`${capacity} person${capacity > 1 ? 's' : ''}`}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Box sx={{
                      p: { xs: 1, sm: 1.5, md: 2 },
                      bgcolor: 'grey.50',
                      borderRadius: { xs: 1, md: 2 },
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}>
                      <LabeledValue
                        icon={<ClockCircleOutlined style={{ color: '#1976d2', fontSize: '1.2rem' }} />}
                        title="Stay Duration"
                        subTitle={`${maxStayDuration} hour${maxStayDuration > 1 ? 's' : ''}`}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1.5, sm: 2, md: 3 }}
                  alignItems='center'
                  justifyContent='center'
                  sx={{ pt: { xs: 0.5, sm: 1, md: 2 } }}
                >
                  <AnimateButton>
                    <Button
                      component={Link}
                      to={`/accommodations/details/${_id}`}
                      variant="contained"
                      startIcon={<ArrowRightOutlined />}
                      sx={{
                        borderRadius: { xs: 1.5, md: 3 },
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem', lg: '1.1rem' },
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { sm: 120, md: 140 },
                      }}
                    >
                      Explore Details
                    </Button>
                  </AnimateButton>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontStyle: 'italic',
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.875rem' },
                      textAlign: 'center',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    Experience luxury and comfort
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  )
}

export default AccommodationGrid
