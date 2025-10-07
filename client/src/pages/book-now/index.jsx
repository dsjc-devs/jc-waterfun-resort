import React from 'react'
import PageTitle from 'components/PageTitle'
import CheckAvailability from 'sections/landing-pages/book-now/CheckAvailability'
import MapSection from 'sections/landing-pages/MapSection'

const BookNow = () => {
  return (
    <React.Fragment>
      <PageTitle title='Book Now' isOnportal={false} />

      <CheckAvailability />
      <MapSection />
    </React.Fragment>
  )
}

export default BookNow