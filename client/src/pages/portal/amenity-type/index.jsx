import { APP_DEFAULT_PATH } from 'config/config';

import React from 'react'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import PageTitle from 'components/PageTitle'
import AmenityTypeTable from 'sections/portal/modules/amenity-type/Table';

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Amenity Types' }
];

const AmenityTypes = () => {
  return (
    <React.Fragment>
      <PageTitle title="Amenity Types" />
      <Breadcrumbs
        custom
        heading="Amenity Types"
        links={breadcrumbLinks}
        subheading="View, manage, and organize available amenity types."
      />

      <AmenityTypeTable />
    </React.Fragment>
  )
}

export default AmenityTypes