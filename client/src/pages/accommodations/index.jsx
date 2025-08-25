import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Box, Container, Pagination, Stack, Typography } from '@mui/material'
import { useGetAccommodations } from 'api/accommodations'

import PageTitle from 'components/PageTitle'
import textFormatter from 'utils/textFormatter'
import Banner from 'components/Banner'
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard'
import AccommodationGrid from 'components/accommodations/AccommodationGrid'
import EmptyLongCard from 'components/cards/skeleton/EmptyLongCard'

import banner from 'assets/images/upload/banner.jpg'

const Accommodations = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get("type")

  const [page, setPage] = useState(1)
  const limit = 3

  const { data, isLoading } = useGetAccommodations({
    type,
    page,
    limit,
    sort: "name"
  })

  const { accommodations = [], totalPages = 0, totalAccommodations } = data || {}
  const pageCount = totalPages

  const isEmpty = !isLoading && accommodations?.length === 0

  useEffect(() => {
    if (!type) {
      window.location.href = "*"
    }
  }, [location, type])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [accommodations]);

  return (
    <React.Fragment>
      <PageTitle title={`Accommodations - ${textFormatter.fromSlug(type)}`} />

      <Banner
        image={banner}
        title={textFormatter.fromSlug(type)}
        subtitle="Accommodations"
      />

      <Box>
        {isLoading && (
          <Container>
            {Array.from({ length: 3 }).map((_, idx) => (
              <EmptyLongCard />
            ))}
          </Container>
        )}

        {isEmpty && (
          <EmptyUserCard
            title={`No ${textFormatter.fromSlug(type)} found.`}
          />
        )}

        {!isEmpty && (
          <React.Fragment>
            {accommodations?.map((acc, idx) => (
              <AccommodationGrid key={acc.id || idx} accomData={acc} index={idx} />
            ))}

            {pageCount > 1 && (
              <Stack alignItems="center" mt={6}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Stack>
            )}

            <Box my={2}>
              <Typography variant="body2" textAlign='center' color="text.secondary">
                Showing {accommodations.length} of {totalAccommodations} {textFormatter.fromSlug(type)}
              </Typography>

              <Typography variant="body2" textAlign='center' color="text.secondary">
                Total: {totalAccommodations} {textFormatter.fromSlug(type)}
              </Typography>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </React.Fragment>
  )
}

export default Accommodations
