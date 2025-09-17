import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import CarouselSection from "sections/landing-pages/CarouselSection";
import RateSection from "sections/landing-pages/RateSection";
import ContactUsHomePage from "sections/landing-pages/ContactUs";
import AboutUs from "sections/landing-pages/AboutUs";
import DiscoverSection from "sections/landing-pages/DiscoverSection";
import MapSection from "sections/landing-pages/MapSection";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <React.Fragment>
      <CarouselSection />
      <RateSection />
      <ContactUsHomePage />
      <AboutUs />
      <DiscoverSection />
      <MapSection />

    </React.Fragment>
  );
};

export default Home;
