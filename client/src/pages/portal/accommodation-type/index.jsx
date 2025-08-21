import React from 'react'

import { APP_DEFAULT_PATH } from 'config/config';

import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import AccommodationTypeTable from 'sections/portal/modules/accommodation-type/Table';

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Content Management - Accommodation Types' }
];

const AccommodationType = () => {
  return (
    <React.Fragment>
      <PageTitle title="Accommodation Types" />

      <Breadcrumbs
        custom
        heading="Accommodation Types"
        links={breadcrumbLinks}
        subheading="Manage and organize the different types of accommodations available."
      />

      <AccommodationTypeTable />
    </React.Fragment>
  )
}

export default AccommodationType
