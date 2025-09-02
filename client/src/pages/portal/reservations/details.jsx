import { APP_DEFAULT_PATH } from 'config/config';
import { useParams } from 'react-router';
import { useGetSingleReservation } from 'api/reservations';

import React from 'react'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import PageTitle from 'components/PageTitle'
import Details from 'sections/portal/modules/reservations/Details';

const breadcrumbLinks = [
  { title: "Home", to: APP_DEFAULT_PATH },
  { title: "Reservations", to: '/portal/reservations' },
  { title: "Reservation Details" },
];

const ReservationDetails = () => {
  const { id } = useParams();

  const { data = {} } = useGetSingleReservation(id);

  return (
    <React.Fragment>
      <PageTitle title="Reservation Details" />
      <Breadcrumbs
        custom
        heading="Reservation Details"
        links={breadcrumbLinks}
        subheading="View, manage, and track reservations at John Cezar Waterfun Resort."
      />

      <Details
        reservationData={data}
      />
    </React.Fragment>
  );
}

export default ReservationDetails