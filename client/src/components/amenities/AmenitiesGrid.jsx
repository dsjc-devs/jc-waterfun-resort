import React from 'react';
import { Box, Button, Card, CardMedia, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import AnimateButton from 'components/@extended/AnimateButton';
import formatPeso from 'utils/formatPrice';
import textFormatter from 'utils/textFormatter';

const AmenitiesGrid = ({ amenityData, index }) => {
  const navigate = useNavigate();

  const {
    _id,
    name,
    thumbnail,
    type,
    description,
    price,
  } = amenityData || {};

  const isEven = index % 2 === 0;

  const handleViewDetails = () => {
    navigate(`/amenities/details/${_id}`);
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: isEven ? '#fafafa' : '#fff',
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          direction={isEven ? 'row' : 'row-reverse'}
        >
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }
              }}
            >
              <CardMedia
                component="img"
                image={thumbnail}
                alt={name}
                sx={{
                  height: { xs: 240, md: 280 },
                  objectFit: 'cover',
                }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  color: 'text.primary',
                  lineHeight: 1.3,
                  fontFamily: 'Cinzel'
                }}
              >
                {name}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  maxWidth: '480px'
                }}
              >
                {description}
              </Typography>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1
                  }}
                >
                  {formatPeso(price)}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      fontWeight: 400
                    }}
                  >
                    per use
                  </Typography>
                </Typography>
              </Box>

              <Box sx={{ pt: 1 }}>
                <AnimateButton>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<EyeOutlined />}
                    onClick={handleViewDetails}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.35)',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </AnimateButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AmenitiesGrid;