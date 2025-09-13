import { APP_DEFAULT_PATH } from 'config/config';
import { useLocation } from 'react-router';

import React from 'react';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import Form from 'sections/portal/modules/reservations/Form'

const ReservationForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const isEditMode = queryParams.get('isEditMode') === 'true';

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Reservations', to: '/portal/reservations' },
    { title: isEditMode ? 'Edit Reservation' : 'New Reservation' }
  ];

  return (
    <React.Fragment>
      <PageTitle title="Reservation Form" />

      <Breadcrumbs
        custom
        heading={isEditMode ? 'Edit Reservation' : 'Create Reservation'}
        links={breadcrumbLinks}
        subheading={
          isEditMode
            ? 'Update details of an existing reservation at the resort.'
            : 'Fill out the form to create a new reservation at the resort.'
        }
      />

      <Form />
    </React.Fragment>
  );
};

export default ReservationForm;
