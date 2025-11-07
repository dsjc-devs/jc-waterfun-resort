import React from 'react';
import RateSection from 'sections/landing-pages/RateSection';
import WhatsIncludedSection from 'sections/landing-pages/WhatsIncludedSection';
import ResortFacilitiesSection from 'sections/landing-pages/ResortFacilitiesSection';
import BookingPaymentSection from 'sections/landing-pages/BookingPaymentSection';
import GroupPackagesSection from 'sections/landing-pages/GroupPackagesSection';
import ContactLocationSection from 'sections/landing-pages/ContactLocationSection';
import ImportantInfoSection from 'sections/landing-pages/ImportantInfoSection';
import MapSection from 'sections/landing-pages/MapSection';
import FAQs from 'sections/landing-pages/FAQs';


const ResortRates = () => {
  return (
    <React.Fragment>
      <RateSection isDisplayLearnMore={false} />
      <WhatsIncludedSection />
      <ResortFacilitiesSection />
      <BookingPaymentSection />
      <GroupPackagesSection />
      <ContactLocationSection />
      <ImportantInfoSection />
      <MapSection />
      <FAQs />
    </React.Fragment>
  );
};

export default ResortRates;