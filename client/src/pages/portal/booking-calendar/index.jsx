import { useGetReservations } from 'api/reservations';
import { APP_DEFAULT_PATH } from 'config/config';

import Breadcrumbs from 'components/@extended/Breadcrumbs'
import PageTitle from 'components/PageTitle'
import React from 'react'
import Calendar from 'sections/portal/modules/reservations/Calendar'

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Booking Calendar' }
];

const BookingCalendar = () => {
  const { data } = useGetReservations()
  const { reservations } = data || {}

  return (
    <React.Fragment>
      <PageTitle title="Booking Calendar" />

      <Breadcrumbs
        custom
        heading="Booking Calendar"
        links={breadcrumbLinks}
        subheading="View and manage all upcoming, current, and past reservations in a calendar format."
      />

      <Calendar events={reservations} title='Resort Reservation Calendar' subtitle='View all upcoming reservations, maintenance, and events. Hover over events for details.' />
    </React.Fragment>
  )
}

export default BookingCalendar