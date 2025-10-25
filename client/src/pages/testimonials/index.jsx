import { useNavigate } from 'react-router'

import React from 'react'
import Banner from 'components/Banner'
import gallery from 'assets/images/upload/banner2.jpg'
import PageTitle from 'components/PageTitle'
import Testimonials from 'sections/landing-pages/Testimonials'
import Hero from 'sections/landing-pages/Hero'

import bgImg from "assets/images/upload/about-us-cta.jpg";


const TestimonialsPage = () => {

  const navigate = useNavigate()
  return (
    <React.Fragment>
      <PageTitle title="Testimonials" />

      <Banner
        title="What Our Guests Say"
        subtitle="Read testimonials from our satisfied visitors"
        image={gallery}
      />

      <Testimonials isHomepage={false} />

      <Hero
        backgroundImage={bgImg}
        buttonConfigs={{
          label: "Book Now",
          action: () => {
            navigate('/book-now')
          }
        }}
      />
    </React.Fragment>
  )
}

export default TestimonialsPage