import React from 'react'
import { APP_DEFAULT_PATH } from 'config/config';
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CustomersTable from 'sections/portal/modules/customers/Table';

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Customers' }
];

const Customers = () => {
  return (
    <React.Fragment>
      <PageTitle title="Customers" />

      <Breadcrumbs
        custom
        heading="Customers"
        links={breadcrumbLinks}
        subheading="Keep track of your customers and their bookings."
      />

      <CustomersTable queryObj={{ "position.value": "CUSTOMER" }} />
    </React.Fragment>
  )
}

export default Customers