import { Container } from '@mui/material'
import { useGetSingleAmenity } from 'api/amenities'
import { useParams } from 'react-router'

import React from 'react'
import Banner from 'components/Banner'
import PageTitle from 'components/PageTitle'
import AmenityPage from 'sections/portal/AmenityPage'
import textFormatter from 'utils/textFormatter'

const AmenityDetails = () => {
  const { id } = useParams()

  const { data = {}, isLoading } = useGetSingleAmenity(id)
  const {
    type,
    name,
    thumbnail
  } = data || {}

  return (
    <React.Fragment>
      <PageTitle isOnportal={false} title={name} />

      <Container>
        <AmenityPage
          data={data}
          isLoading={isLoading}
          isOnPortal={false}
        />
      </Container>
    </React.Fragment>
  )
}

export default AmenityDetails