import { ClockCircleOutlined, MoneyCollectOutlined, UserOutlined } from '@ant-design/icons'
import { Box, Grid, Typography, Chip, Stack, Button, Container } from '@mui/material'
import AnimateButton from 'components/@extended/AnimateButton'
import LabeledValue from 'components/LabeledValue'
import { icons } from 'menu-items/modules'
import React from 'react'
import Carousel from 'react-material-ui-carousel'
import { Link } from 'react-router-dom'
import formatPeso from 'utils/formatPrice'

const AccommodationGrid = ({ accomData = {}, index = 0 }) => {
  const isOdd = index % 2 !== 0

  const {
    name,
    description,
    thumbnail,
    price,
    capacity,
    maxStayDuration,
    pictures = []
  } = accomData || {}

  return (
    <Box sx={{ py: 20, bgcolor: isOdd ? '#f2f4f3' : '#fff' }}>
      <Container>
        <Grid container alignItems="center" spacing={{ sm: 0, md: 2 }}>
          <Grid item xs={12} md={6} order={{ xs: 1, md: isOdd ? 2 : 1 }}>
            <Carousel
              autoPlay={false}
              duration={500}
              animation="slide"
              navButtonsAlwaysVisible
              indicators={false}
            >
              {[thumbnail, ...pictures].map((item, i) => (
                <Box
                  key={i}
                  component="img"
                  src={item.image || item}
                  alt={name}
                  sx={{
                    width: '100%',
                    height: 500,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                />
              ))}
            </Carousel>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            order={{ xs: 2, md: isOdd ? 1 : 2 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              gap: 2
            }}
          >
            <Typography variant="h3" fontFamily="Cinzel">
              {name}
            </Typography>

            <Box>Day Price: {formatPeso(price?.day)} | Night Price: {formatPeso(price?.night)}</Box>

            <Typography
              variant="body1"
              fontFamily="Istok Web"
              sx={{ opacity: 0.8 }}
            >
              {description}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <LabeledValue
                  icon={<icons.AccountGroupIcon />}
                  title="Guest Capacity"
                  subTitle={`${capacity} person${capacity > 1 ? 's' : ''}`}
                />
              </Grid>
              <Grid item xs={6}>
                <LabeledValue
                  icon={<ClockCircleOutlined />}
                  title="Stay Duration"
                  subTitle={`${maxStayDuration} hour${maxStayDuration > 1 ? 's' : ''}`}
                />
              </Grid>
            </Grid>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems='center' marginBlock={4}>
              <AnimateButton>
                <Button variant='contained' size='small'>
                  Book Now
                </Button>
              </AnimateButton>

              <Box
                component={Link}
                to="/"
                sx={{
                  marginBlock: "1em",
                  color: "#333",
                  textDecoration: "none",
                  transition: ".3s all ease",
                  "&:hover": {
                    cursor: "pointer",
                    opacity: 0.7,
                    color: theme => theme.palette.primary.light
                  }
                }}
              >
                Learn More
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AccommodationGrid
