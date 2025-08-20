import React from 'react';
import { useLocation } from 'react-router-dom';
import { APP_DEFAULT_PATH } from 'config/config';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import textFormatter from 'utils/textFormatter';
import AccommodationGroup from 'sections/portal/modules/accommodations/AccommodationGroup';

const Accommodations = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _type = queryParams.get('type');

  const type = textFormatter.fromSlug(_type)

  const typeDescriptions = {
    room: 'View and manage all room details, pricing, and availability.',
    event_hall: 'Manage bookings and details for event halls.',
    cottage: 'Manage cottage availability, rates, and amenities.',
  };

  const subheading =
    typeDescriptions[type?.toLowerCase()] ||
    'Manage accommodation information, rates, and availability.';

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: `Spaces - ${type}` }
  ];

  return (
    <React.Fragment>
      <PageTitle title={`Accommodation - ${type}`} />

      <Breadcrumbs
        custom
        heading={type || 'Spaces'}
        links={breadcrumbLinks}
        subheading={subheading}
      />

      <AccommodationGroup type={_type} />
    </React.Fragment>
  );
};

export default Accommodations;
