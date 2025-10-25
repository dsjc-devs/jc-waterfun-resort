import { Container } from '@mui/material'

import React from 'react'
import Banner from 'components/Banner'
import gallery from 'assets/images/upload/banner2.jpg'
import PageTitle from 'components/PageTitle'
import GalleryList from 'components/GalleryList'
import MapSection from 'sections/landing-pages/MapSection'
import FAQs from 'sections/landing-pages/FAQs'

const index = () => {
  return (
    <React.Fragment>
      <PageTitle title="Gallery" />
      <Banner
        title="Resort Gallery"
        subtitle="Discover the beauty and experiences at our resort"
        image={gallery}
      />

      <Container
        sx={{ my: 4 }}
      >
        <GalleryList />
      </Container>
    </React.Fragment>
  )
}

export default index