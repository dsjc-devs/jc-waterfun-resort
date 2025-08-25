import { Container } from '@mui/material'
import { useGetSingleAccommodation } from 'api/accommodations'
import Banner from 'components/Banner'
import MainCard from 'components/MainCard'
import PageTitle from 'components/PageTitle'
import React from 'react'
import { useParams } from 'react-router'
import AccommodationPage from 'sections/dynamic-pages/AccommodationPage'
import textFormatter from 'utils/textFormatter'

const AccommodationDetails = () => {
  const { id } = useParams()

  const { data = {}, isLoading } = useGetSingleAccommodation(id)
  const {
    type,
    name,
    thumbnail
  } = data || {}

  return (
    <React.Fragment>
      <PageTitle isOnportal={false} title={name} />

      <Banner
        image={thumbnail}
        title={name}
        subtitle={textFormatter.fromSlug(type)}
      />

      <Container>
        <AccommodationPage
          data={data}
          isLoading={isLoading}
          isOnPortal={false}
        />
      </Container>
    </React.Fragment>
  )
}

export default AccommodationDetails