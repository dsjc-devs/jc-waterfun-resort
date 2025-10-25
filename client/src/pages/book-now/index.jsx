import React from 'react'
import PageTitle from 'components/PageTitle'
import CheckAvailability from 'sections/landing-pages/book-now/CheckAvailability'
import MapSection from 'sections/landing-pages/MapSection'
import FAQs from 'sections/landing-pages/FAQs'

const BookNow = () => {
  return (
    <React.Fragment>
      <PageTitle title='Book Now' isOnportal={false} />

      <CheckAvailability />
      <MapSection />
      <FAQs />
    </React.Fragment>
  )
}

export default BookNow