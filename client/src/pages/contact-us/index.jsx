import { useNavigate } from 'react-router-dom';

import React from 'react';
import PageTitle from 'components/PageTitle';
import Banner from 'components/Banner';
import MapSection from 'sections/landing-pages/MapSection';
import ContactUsSection from 'sections/landing-pages/contact-us/ContactUsSection';
import Hero from 'sections/landing-pages/Hero';

import contactUs from 'assets/images/upload/contact-us-header.jpg';
import contactUsCTA from 'assets/images/upload/contact-us-cta.jpg';

const ContactUs = () => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <PageTitle title="Contact Us" isOnportal={false} />

      <Banner
        image={contactUs}
        title='Contact Us'
        subtitle='We are always willing to serve'
      />

      <ContactUsSection />

      <Hero
        backgroundImage={contactUsCTA}
        title="Start Your Paradise Journey Today"
        subtitle="Make Your Dream Vacation a Reality"
        caption="Let us help you plan your perfect stay at JC Waterfun Resort - where every moment becomes a cherished memory."
        buttonConfigs={{
          label: "Book Now",
          action: () => navigate('/book-now'),
          sx: {
            background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
            color: '#ffffff',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(67,206,162,0.25)',
            }
          }
        }}
      />

      <MapSection />
    </React.Fragment>
  );
};

export default ContactUs;
