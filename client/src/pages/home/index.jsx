import React from "react";
import { Box } from "@mui/material";

import AboutUs from "sections/landing-pages/AboutUs";
import CarouselSection from "sections/landing-pages/CarouselSection";
import ContactUsHomePage from "sections/landing-pages/ContactUs";
import DiscoverSection from "sections/landing-pages/DiscoverSection";
import RateSection from "sections/landing-pages/RateSection";
import MapSection from "sections/landing-pages/MapSection";

const Home = () => {
  return (
    <React.Fragment>
      <Box data-aos="fade-up">
        <CarouselSection />
      </Box>

      <Box data-aos="fade-up" data-aos-delay="200">
        <RateSection />
      </Box>

      <Box data-aos="fade-up" data-aos-delay="400">
        <ContactUsHomePage />
      </Box>

      <Box data-aos="fade-up" data-aos-delay="600">
        <AboutUs />
      </Box>

      <Box data-aos="fade-up" data-aos-delay="800">
        <DiscoverSection />
      </Box>

      <Box data-aos="fade-up" data-aos-delay="800">
        <MapSection />
      </Box>
    </React.Fragment>
  );
};

export default Home;
