import React from 'react';
import { useLocation } from 'react-router-dom';
import { APP_DEFAULT_PATH } from 'config/config';

import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import textFormatter from 'utils/textFormatter';
import AmenitiesGroup from 'sections/portal/modules/amenities/AmenitiesGroup';

const Amenities = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _type = queryParams.get('type');

  const type = textFormatter.fromSlug(_type);

  const typeDescriptions = {
    pool: 'Manage pool amenities, schedules, and maintenance.',
    playground: 'View and update playground equipment and safety checks.',
    restaurant: 'Manage restaurant menus, hours, and reservations.',
  };

  const subheading =
    typeDescriptions[type?.toLowerCase()] ||
    'Manage amenities information, schedules, and details.';

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: `Amenities - ${type}` }
  ];

  return (
    <React.Fragment>
      <PageTitle title={`Amenities - ${type}`} />

      <Breadcrumbs
        custom
        heading={type || 'Amenities'}
        links={breadcrumbLinks}
        subheading={subheading}
      />

      <AmenitiesGroup type={_type} />
    </React.Fragment>
  );
};

export default Amenities;