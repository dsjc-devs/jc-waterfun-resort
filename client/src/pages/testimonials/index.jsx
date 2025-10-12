import React from 'react'
import Banner from 'components/Banner'
import gallery from 'assets/images/upload/banner2.jpg'
import PageTitle from 'components/PageTitle'
import Testimonials from 'sections/landing-pages/Testimonials'

const index = () => {
  return (
    <React.Fragment>
      <PageTitle title="Testimonials" />

      <Banner
        title="What Our Guests Say"
        subtitle="Read testimonials from our satisfied visitors"
        image={gallery}
      />


        <Testimonials isHomepage={false} />
    </React.Fragment>
  )
}

export default index