import React from 'react'
import { APP_DEFAULT_PATH } from 'config/config';
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import StaffsTable from 'sections/portal/modules/staffs/Table';

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Staffs' }
];

const Staffs = () => {
  return (
    <React.Fragment>
      <PageTitle title="Staffs" />

      <Breadcrumbs
        custom
        heading="Staffs"
        links={breadcrumbLinks}
        subheading="Manage staff information, roles, and access within the resort system."
      />

      <StaffsTable queryObj={{ "position.value": "RECEPTIONIST,ADMIN,MASTER_ADMIN" }} />
    </React.Fragment>
  )
}

export default Staffs