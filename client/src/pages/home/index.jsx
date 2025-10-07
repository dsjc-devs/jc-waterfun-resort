import { useNavigate } from "react-router";

import React from "react";
import CarouselSection from "sections/landing-pages/CarouselSection";
import MiniCheckAvailability from "sections/landing-pages/MiniCheckAvailability";
import RateSection from "sections/landing-pages/RateSection";
import Hero from "sections/landing-pages/Hero";
import ContactUsHomePage from "sections/landing-pages/ContactUs";
import AboutUs from "sections/landing-pages/AboutUs";
import DiscoverSection from "sections/landing-pages/DiscoverSection";
import MapSection from "sections/landing-pages/MapSection";
import FAQs from "sections/landing-pages/FAQs";

import bgImg from "assets/images/upload/our-mission.jpg";

const Home = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <CarouselSection />
      <MiniCheckAvailability />
      <RateSection />
      <Hero
        backgroundImage={bgImg}
        buttonConfigs={{
          label: "Book Now",
          action: () => {
            navigate('/book-now')
          }
        }}
      />
      <ContactUsHomePage />
      <DiscoverSection />
      <AboutUs />
      <MapSection />
      <FAQs />
    </React.Fragment >
  );
};

export default Home;
