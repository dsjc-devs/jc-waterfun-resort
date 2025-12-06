import React, { useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Avatar, Typography, Stack, Skeleton, Rating, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Pagination } from '@mui/material';
import { FormatQuote, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Slider from 'react-slick';
import { Link as RouterLink } from 'react-router-dom';
import { useGetTestimonials } from 'api/testimonials';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import TitleTag from 'components/TitleTag2';
import ConvertDate from 'components/ConvertDate';

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: -20,
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: '#f29023',
      color: '#fff',
      '&:hover': {
        bgcolor: '#d17a1a',
      },
      width: 50,
      height: 50,
      boxShadow: '0 4px 12px rgba(242, 144, 35, 0.3)',
    }}
  >
    <ArrowForwardIos />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: -20,
      transform: 'translateY(-50%)',
      zIndex: 2,
      bgcolor: '#f29023',
      color: '#fff',
      '&:hover': {
        bgcolor: '#d17a1a',
      },
      width: 50,
      height: 50,
      boxShadow: '0 4px 12px rgba(242, 144, 35, 0.3)',
    }}
  >
    <ArrowBackIos sx={{ ml: 1 }} />
  </IconButton>
);

const Testimonials = ({ isHomepage = true }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const queryParams = isHomepage
    ? { isPosted: true }
    : { isPosted: true, page, limit: itemsPerPage };

  const { data, isLoading } = useGetTestimonials(queryParams);
  const testimonials = data?.testimonials || [];
  const totalPages = data?.totalPages || 1;
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const hasNoData = !isLoading && testimonials.length === 0;

  if (isHomepage && hasNoData) {
    return null;
  }

  const total = testimonials.length;
  const showDesktop = Math.min(3, Math.max(total, 1));
  const showTablet = Math.min(2, Math.max(total, 1));
  const canCarousel = isHomepage && total >= 3;

  const sliderSettings = {
    dots: false,
    infinite: total > 3,
    speed: 500,
    slidesToShow: showDesktop,
    slidesToScroll: 1,
    autoplay: total > 3,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: total > 3,
    nextArrow: total > 3 ? <NextArrow /> : null,
    prevArrow: total > 3 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: showTablet,
          slidesToScroll: 1,
          arrows: total > 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ],
    dotsClass: 'slick-dots custom-dots',
  };


  return (
    <Box sx={{ py: 8, bgcolor: '#f7f9f8' }}>
      <Container maxWidth="xl" disableGutters={isHomepage}>
        <Stack spacing={2} alignItems="center" mb={6}>
          <TitleTag title="Testimonials" subtitle="Hear what our valued guests have to say about their experiences with us." color='#f29023' />
        </Stack>

        {isLoading ? (
          <Grid container spacing={4}>
            {[1, 2, 3].map((n) => (
              <Grid item xs={12} md={4} key={n}>
                <Card sx={{ height: '100%', borderRadius: 3, p: 4 }}>
                  <Stack alignItems="center" spacing={3}>
                    <Skeleton variant="circular" width={100} height={100} />
                    <Skeleton variant="rectangular" width="100%" height={120} />
                    <Skeleton variant="text" width="60%" height={30} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : hasNoData ? (
          isHomepage ? null : (
            <Box sx={{ width: '100%' }}>
              <EmptyUserCard title="No testimonials available yet." />
            </Box>
          )
        ) : isHomepage ? (
          canCarousel ? (
            <Box sx={{ position: 'relative' }}>
              <Slider {...sliderSettings}>
                {testimonials.map((testimonial, idx) => {
                  const fullName = `${testimonial.firstName} ${testimonial.lastName}`;
                  const initials = `${testimonial.firstName?.[0] || ''}${testimonial.lastName?.[0] || ''}`;
                  const reservationDate = testimonial.reservationCreatedAt ? new Date(testimonial.reservationCreatedAt) : null;

                  return (
                    <Box key={`${testimonial.testimonialId}-${idx}`} px={{ xs: 1.5, md: 2 }} sx={{ height: '100%' }}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          bgcolor: '#fff',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                          }
                        }}
                      >
                        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <Stack alignItems="center" spacing={3} sx={{ height: '100%' }}>
                            <Avatar
                              alt={fullName}
                              sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid #fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                mt: -6,
                                bgcolor: '#0B4F71',
                                fontSize: 32,
                                fontWeight: 600
                              }}
                            >
                              {initials}
                            </Avatar>

                            {testimonial.rating && (
                              <Rating
                                value={testimonial.rating}
                                readOnly
                                size="small"
                                sx={{
                                  '& .MuiRating-iconFilled': {
                                    color: '#f29023'
                                  }
                                }}
                              />
                            )}

                            <Box sx={{ position: 'relative', width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <FormatQuote
                                sx={{
                                  fontSize: 40,
                                  color: '#f29023',
                                  opacity: 0.3,
                                  position: 'absolute',
                                  top: -20,
                                  left: -10
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="Poppins"
                                textAlign="center"
                                sx={{
                                  position: 'relative',
                                  px: 2,
                                  lineHeight: 1.8,
                                  mb: 1,
                                  minHeight: 96,
                                  wordBreak: 'break-word'
                                }}
                              >
                                {testimonial.remarks && testimonial.remarks.length > 200
                                  ? `${testimonial.remarks.slice(0, 200)}...`
                                  : testimonial.remarks}
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => setSelectedTestimonial(testimonial)}
                                sx={{
                                  color: '#f29023',
                                  textTransform: 'none',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  '&:hover': {
                                    bgcolor: 'rgba(242, 144, 35, 0.08)'
                                  }
                                }}
                              >
                                See More
                              </Button>
                              <FormatQuote
                                sx={{
                                  fontSize: 40,
                                  color: '#f29023',
                                  opacity: 0.3,
                                  position: 'absolute',
                                  bottom: -20,
                                  right: -10,
                                  transform: 'rotate(180deg)'
                                }}
                              />
                            </Box>

                            <Box textAlign="center" sx={{ mt: 'auto' }}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                fontFamily="Poppins"
                                color="#f29023"
                              >
                                {fullName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="Poppins"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {testimonial.emailAddress}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontFamily="Poppins"
                                sx={{ display: 'block', mt: 0.5 }}
                              >
                                Booked a reservation on: <ConvertDate dateString={testimonial.reservationCreatedAt} />
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Slider>
              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  component={RouterLink}
                  to="/testimonials"
                  variant="contained"
                  sx={{
                    bgcolor: '#f29023',
                    '&:hover': { bgcolor: '#d17a1a' },
                    px: 4,
                    py: 1.25,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  View More
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={4} justifyContent="center">
                {testimonials.map((testimonial) => {
                  const fullName = `${testimonial.firstName} ${testimonial.lastName}`;
                  const initials = `${testimonial.firstName?.[0] || ''}${testimonial.lastName?.[0] || ''}`;
                  const reservationDate = testimonial.reservationCreatedAt ? new Date(testimonial.reservationCreatedAt) : null;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={testimonial.testimonialId}>
                      <Card
                        sx={{
                          height: '100%',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          bgcolor: '#fff',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                          }
                        }}
                      >
                        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <Stack alignItems="center" spacing={3} sx={{ height: '100%' }}>
                            <Avatar
                              alt={fullName}
                              sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid #fff',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                mt: -6,
                                bgcolor: '#0B4F71',
                                fontSize: 32,
                                fontWeight: 600
                              }}
                            >
                              {initials}
                            </Avatar>

                            {testimonial.rating && (
                              <Rating
                                value={testimonial.rating}
                                readOnly
                                size="small"
                                sx={{
                                  '& .MuiRating-iconFilled': {
                                    color: '#f29023'
                                  }
                                }}
                              />
                            )}

                            <Box sx={{ position: 'relative', width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <FormatQuote
                                sx={{
                                  fontSize: 40,
                                  color: '#f29023',
                                  opacity: 0.3,
                                  position: 'absolute',
                                  top: -20,
                                  left: -10
                                }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="Poppins"
                                textAlign="center"
                                sx={{
                                  position: 'relative',
                                  px: 2,
                                  lineHeight: 1.8,
                                  mb: 1,
                                  minHeight: 96,
                                  wordBreak: 'break-word'
                                }}
                              >
                                {testimonial.remarks && testimonial.remarks.length > 200
                                  ? `${testimonial.remarks.slice(0, 200)}...`
                                  : testimonial.remarks}
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => setSelectedTestimonial(testimonial)}
                                sx={{
                                  color: '#f29023',
                                  textTransform: 'none',
                                  fontSize: '0.875rem',
                                  fontWeight: 600,
                                  '&:hover': {
                                    bgcolor: 'rgba(242, 144, 35, 0.08)'
                                  }
                                }}
                              >
                                See More
                              </Button>
                              <FormatQuote
                                sx={{
                                  fontSize: 40,
                                  color: '#f29023',
                                  opacity: 0.3,
                                  position: 'absolute',
                                  bottom: -20,
                                  right: -10,
                                  transform: 'rotate(180deg)'
                                }}
                              />
                            </Box>

                            <Box textAlign="center" sx={{ mt: 'auto' }}>
                              <Typography
                                variant="h6"
                                fontWeight={600}
                                fontFamily="Poppins"
                                color="#f29023"
                              >
                                {fullName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="Poppins"
                                sx={{ fontSize: '0.875rem' }}
                              >
                                {testimonial.emailAddress}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontFamily="Poppins"
                                sx={{ display: 'block', mt: 0.5 }}
                              >
                                Booked a reservation on: <ConvertDate dateString={reservationDate} />
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              <Stack direction="row" justifyContent="center" mt={4}>
                <Button
                  component={RouterLink}
                  to="/testimonials"
                  variant="contained"
                  sx={{
                    bgcolor: '#f29023',
                    '&:hover': { bgcolor: '#d17a1a' },
                    px: 4,
                    py: 1.25,
                    borderRadius: 2,
                    fontWeight: 600
                  }}
                >
                  View More
                </Button>
              </Stack>
            </Box>
          )
        ) : (
          <Box>
            <Grid container spacing={4}>
              {testimonials.map((testimonial) => {
                const fullName = `${testimonial.firstName} ${testimonial.lastName}`;
                const initials = `${testimonial.firstName?.[0] || ''}${testimonial.lastName?.[0] || ''}`;

                return (
                  <Grid item xs={12} sm={6} md={4} key={testimonial.testimonialId}>
                    <Card
                      sx={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        bgcolor: '#fff',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Stack alignItems="center" spacing={3} sx={{ height: '100%' }}>
                          <Avatar
                            alt={fullName}
                            sx={{
                              width: 100,
                              height: 100,
                              border: '4px solid #fff',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              mt: -6,
                              bgcolor: '#0B4F71',
                              fontSize: 32,
                              fontWeight: 600
                            }}
                          >
                            {initials}
                          </Avatar>

                          {testimonial.rating && (
                            <Rating
                              value={testimonial.rating}
                              readOnly
                              size="small"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#f29023'
                                }
                              }}
                            />
                          )}

                          <Box sx={{ position: 'relative', width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <FormatQuote
                              sx={{
                                fontSize: 40,
                                color: '#f29023',
                                opacity: 0.3,
                                position: 'absolute',
                                top: -20,
                                left: -10
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontFamily="Poppins"
                              textAlign="center"
                              sx={{
                                position: 'relative',
                                px: 2,
                                lineHeight: 1.8,
                                mb: 1,
                                minHeight: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                wordBreak: 'break-word'
                              }}
                            >
                              {testimonial.remarks && testimonial.remarks.length > 200
                                ? `${testimonial.remarks.slice(0, 200)}...`
                                : testimonial.remarks}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => setSelectedTestimonial(testimonial)}
                              sx={{
                                color: '#f29023',
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                '&:hover': {
                                  bgcolor: 'rgba(242, 144, 35, 0.08)'
                                }
                              }}
                            >
                              See More
                            </Button>
                            <FormatQuote
                              sx={{
                                fontSize: 40,
                                color: '#f29023',
                                opacity: 0.3,
                                position: 'absolute',
                                bottom: -20,
                                right: -10,
                                transform: 'rotate(180deg)'
                              }}
                            />
                          </Box>

                          <Box textAlign="center" sx={{ mt: 'auto' }}>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              fontFamily="Poppins"
                              color="#f29023"
                            >
                              {fullName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontFamily="Poppins"
                              sx={{ fontSize: '0.875rem' }}
                            >
                              {testimonial.emailAddress}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontFamily="Poppins"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              Booked a reservation on: <ConvertDate dateString={testimonial.reservationCreatedAt} />
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            {totalPages > 1 && (
              <Stack direction="row" justifyContent="center" mt={6}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#f29023',
                      '&.Mui-selected': {
                        bgcolor: '#f29023',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#d17a1a'
                        }
                      }
                    }
                  }}
                />
              </Stack>
            )}
          </Box>
        )}

        {isHomepage && (
          <style jsx global>{`
          /* make slick slides stretch evenly and center */
          .slick-track {
            display: flex;
            align-items: stretch;
          }
          .slick-slide > div {
            height: 100%;
            display: flex !important;
          }
        `}</style>
        )}
      </Container>

      <Dialog
        open={Boolean(selectedTestimonial)}
        onClose={() => setSelectedTestimonial(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }
        }}
      >
        {selectedTestimonial && (
          <>
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
              <Stack alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#0B4F71',
                    fontSize: 28,
                    fontWeight: 600
                  }}
                >
                  {`${selectedTestimonial.firstName?.[0] || ''}${selectedTestimonial.lastName?.[0] || ''}`}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700} fontFamily="Poppins" color="#f29023">
                    {`${selectedTestimonial.firstName} ${selectedTestimonial.lastName}`}
                  </Typography>
                  {selectedTestimonial.emailAddress && (
                    <Typography variant="body2" color="text.secondary" fontFamily="Poppins">
                      {selectedTestimonial.emailAddress}
                    </Typography>
                  )}
                  <Stack direction="row" justifyContent="center" mt={1}>
                    <Rating
                      value={selectedTestimonial.rating}
                      readOnly
                      size="small"
                      sx={{ '& .MuiRating-iconFilled': { color: '#f29023' } }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <FormatQuote
                  sx={{
                    fontSize: 40,
                    color: '#f29023',
                    opacity: 0.2,
                    position: 'absolute',
                    top: -10,
                    left: -10
                  }}
                />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontFamily="Poppins"
                  sx={{
                    px: 3,
                    py: 2,
                    lineHeight: 1.8,
                    textAlign: 'center',
                    wordBreak: 'break-word'
                  }}
                >
                  {selectedTestimonial.remarks}
                </Typography>
                <FormatQuote
                  sx={{
                    fontSize: 40,
                    color: '#f29023',
                    opacity: 0.2,
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    transform: 'rotate(180deg)'
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                onClick={() => setSelectedTestimonial(null)}
                variant="contained"
                sx={{
                  bgcolor: '#f29023',
                  '&:hover': {
                    bgcolor: '#d17a1a'
                  },
                  px: 4
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Testimonials;