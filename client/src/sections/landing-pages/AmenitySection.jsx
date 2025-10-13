import { Box, Container, Pagination, Stack, Typography } from '@mui/material'
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
  return (
    <React.Fragment>
      <Box sx={{ bgcolor: '#fafafa' }}>
        {isLoading && (
          <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4, md: 8 }, px: { xs: 1, sm: 2, md: 3 } }}>
            <Stack spacing={{ xs: 2, sm: 3, md: 6 }}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <EmptyLongCard key={idx} />
              ))}
            </Stack>
          </Container>
        )}

        {isEmpty && (
          <Box sx={{ py: { xs: 4, sm: 6, md: 12 }, px: { xs: 2, sm: 3 } }}>
            <EmptyUserCard
              title={`No ${textFormatter.fromSlug(type)} found.`}
            />
          </Box>
        )}

        {!isEmpty && (
          <React.Fragment>
            <Box sx={{ bgcolor: '#fff' }}>
              {amenities?.map((amenity, idx) => (
                <AmenitiesGrid key={amenity.id || idx} amenityData={amenity} index={idx} />
              ))}
            </Box>

            {pageCount > 1 && (
              <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 2, sm: 3, md: 6 }, px: { xs: 1, sm: 2 } }}>
                <Stack alignItems="center">
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size="medium"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 'bold',
                        borderRadius: { xs: 1, md: 2 },
                        fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.875rem' },
                        minWidth: { xs: 28, md: 32 },
                        height: { xs: 28, md: 32 }
                      }
                    }}
                  />
                </Stack>
              </Box>
            )}

            <Box sx={{ py: { xs: 1.5, sm: 2, md: 4 }, bgcolor: '#f8f9fa' }}>
              <Container sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
                <Stack alignItems="center" spacing={{ xs: 0.5, md: 1 }}>
                  <Typography
                    variant="body1"
                    textAlign='center'
                    color="text.primary"
                    fontWeight="medium"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}
                  >
                    Showing {amenities.length} of {totalAmenities} {textFormatter.fromSlug(type)}
                  </Typography>
                  <Typography
                    variant="body2"
                    textAlign='center'
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' } }}
                  >
                    Total: {totalAmenities} {textFormatter.fromSlug(type)} available
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