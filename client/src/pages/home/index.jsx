import React from 'react'
import AboutUs from 'sections/landing-pages/AboutUs'
import CarouselSection from 'sections/landing-pages/CarouselSection'
import ContactUsHomePage from 'sections/landing-pages/ContactUs'
import DiscoverSection from 'sections/landing-pages/DiscoverSection'
import RateSection from 'sections/landing-pages/RateSection'

const Home = () => {

  return (
    <React.Fragment>
      <CarouselSection />
      <RateSection />
      <ContactUsHomePage />
      <AboutUs />
      <DiscoverSection />
    </React.Fragment>
  )
}

export default Home