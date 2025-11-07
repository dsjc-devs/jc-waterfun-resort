import { Container } from '@mui/material'
import { useGetSingleAmenity } from 'api/amenities'
import { useParams } from 'react-router'

import React from 'react'
import PageTitle from 'components/PageTitle'
import AmenityPage from 'sections/dynamic-pages/AmenityPage'

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