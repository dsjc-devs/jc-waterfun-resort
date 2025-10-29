import { Box, Container, Pagination, Stack, Typography, useTheme, useMediaQuery, Divider } from '@mui/material'
import AmenitiesGrid from 'components/amenities/AmenitiesGrid'
import EmptyLongCard from 'components/cards/skeleton/EmptyLongCard'
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard'
import React from 'react'
import textFormatter from 'utils/textFormatter'

const AmenitySection = ({
  isLoading = false,
  isEmpty = false,
  amenities = [],
  pageCount = 0,
  page = 1,
  setPage = () => { },
  totalAmenities = 0,
  type = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <React.Fragment>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 50%, #f0f7ff 100%)',
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.02) 0%, transparent 60%)',
            pointerEvents: 'none',
          }
        }}
      >
        {isLoading && (
          <Container maxWidth="xl" sx={{ py: { xs: 4, sm: 6, md: 10 }, px: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
            <Stack spacing={{ xs: 3, sm: 4, md: 6 }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <Box key={idx} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <EmptyLongCard />
                </Box>
              ))}
            </Stack>
          </Container>
        )}

        {isEmpty && (
          <Box sx={{ py: { xs: 8, sm: 12, md: 16 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
            <Container maxWidth="md">
              <Stack alignItems="center" spacing={3}>
                <Box
                  sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    borderRadius: '50%',
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      color: 'primary.main'
                    }}
                  >
                    🏊‍♀️
                  </Typography>
                </Box>

                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Cinzel',
                    fontWeight: 600,
                    color: 'text.primary',
                    textAlign: 'center',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  No {textFormatter.fromSlug(type)} Available
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                    maxWidth: '400px',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    lineHeight: 1.6
                  }}
                >
                  We're currently updating our {textFormatter.fromSlug(type).toLowerCase()}. Please check back soon for exciting new offerings!
                </Typography>
              </Stack>
            </Container>
          </Box>
        )}

        {!isEmpty && (
          <React.Fragment>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {amenities?.map((amenity, idx) => (
                <AmenitiesGrid key={amenity.id || idx} amenityData={amenity} index={idx} />
              ))}
            </Box>

            {pageCount > 1 && (
              <Box
                sx={{
                  py: { xs: 4, sm: 6, md: 8 },
                  px: { xs: 2, sm: 3 },
                  position: 'relative',
                  zIndex: 1,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(99, 65, 49, 0.03) 100%)',
                    pointerEvents: 'none',
                  }
                }}
              >
                <Container maxWidth="lg">
                  <Stack alignItems="center" spacing={3}>
                    <Divider
                      sx={{
                        width: '100%',
                        maxWidth: 200,
                        '&::before, &::after': {
                          borderColor: 'rgba(25, 118, 210, 0.2)',
                        }
                      }}
                    />

                    <Pagination
                      count={pageCount}
                      page={page}
                      onChange={(e, value) => setPage(value)}
                      color="primary"
                      size={isMobile ? "medium" : "large"}
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontWeight: 600,
                          borderRadius: { xs: 2, md: 3 },
                          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                          minWidth: { xs: 36, md: 44 },
                          height: { xs: 36, md: 44 },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          },
                          '&.Mui-selected': {
                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          }
                        }
                      }}
                    />
                  </Stack>
                </Container>
              </Box>
            )}

            <Box
              sx={{
                py: { xs: 3, sm: 4, md: 6 },
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(99, 65, 49, 0.05) 100%)',
                borderTop: '1px solid rgba(25, 118, 210, 0.1)'
              }}
            >
              <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Stack alignItems="center" spacing={{ xs: 1, md: 1.5 }}>
                  <Typography
                    variant="h6"
                    textAlign='center'
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      fontWeight: 600,
                      color: 'primary.main',
                      fontFamily: 'Cinzel'
                    }}
                  >
                    Discover Our Resort {textFormatter.fromSlug(type)}
                  </Typography>

                  <Typography
                    variant="body1"
                    textAlign='center'
                    color="text.primary"
                    fontWeight="medium"
                    sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}
                  >
                    Showing {amenities.length} of {totalAmenities} premium amenities
                  </Typography>

                  <Typography
                    variant="body2"
                    textAlign='center'
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      maxWidth: '500px',
                      lineHeight: 1.5
                    }}
                  >
                    Each amenity is carefully designed to provide you with an unforgettable resort experience
                  </Typography>
                </Stack>
              </Container>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </React.Fragment>
  )
}

export default AmenitySection