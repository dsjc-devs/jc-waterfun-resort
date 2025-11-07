import { useNavigate } from "react-router";

import React from "react";
import CarouselSection from "sections/landing-pages/CarouselSection";
import MiniCheckAvailability from "sections/landing-pages/MiniCheckAvailability";
import AccommodationSection from "sections/landing-pages/AccommodationSection";
import RateSection from "sections/landing-pages/RateSection";
import Hero from "sections/landing-pages/Hero";
import ContactUsHomePage from "sections/landing-pages/ContactUs";
import AboutUs from "sections/landing-pages/AboutUs";
import DiscoverSection from "sections/landing-pages/DiscoverSection";
import MapSection from "sections/landing-pages/MapSection";
import FAQs from "sections/landing-pages/FAQs";
import AmenityOverviewSection from "sections/landing-pages/AmenityOverviewSection";
import GalleryOverviewSection from "sections/landing-pages/GalleryOverviewSection";
import ArticleOverviewSection from "sections/landing-pages/ArticleOverviewSection";
import WhatsIncludedSection from "sections/landing-pages/WhatsIncludedSection";
import ResortFacilitiesSection from "sections/landing-pages/ResortFacilitiesSection";
import BookingPaymentSection from "sections/landing-pages/BookingPaymentSection";
import GroupPackagesSection from "sections/landing-pages/GroupPackagesSection";
import ContactLocationSection from "sections/landing-pages/ContactLocationSection";
import ImportantInfoSection from "sections/landing-pages/ImportantInfoSection";

import bgImg from "assets/images/upload/our-mission.jpg";
import Testimonials from "sections/landing-pages/Testimonials";

const Home = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <CarouselSection />
      <MiniCheckAvailability />
      <RateSection />
      <AccommodationSection />
      <Hero
        backgroundImage={bgImg}
        buttonConfigs={{
          label: "Book Now",
          action: () => {
            navigate('/book-now')
          }
        }}
      />
      <AmenityOverviewSection />
      <WhatsIncludedSection />
      <ResortFacilitiesSection />
      <ContactUsHomePage />
      <BookingPaymentSection />
      <GroupPackagesSection />
      <GalleryOverviewSection />
      <DiscoverSection />
      <AboutUs />
      <ContactLocationSection />
      <ArticleOverviewSection />
      <Testimonials isHomepage={true} />
      <ImportantInfoSection />
      <MapSection />
      <FAQs />
    </React.Fragment >
  );
};

export default Home;
