import React from 'react'
import { APP_DEFAULT_PATH, APP_DEFAULT_NAME } from 'config/config';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';

let breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Dashboard' }
];

const Dashboard = () => {

  return (
    <React.Fragment>
      <PageTitle title='Dashboard' />
      <Breadcrumbs
        custom
        heading="Dashboard"
        links={breadcrumbLinks}
        subheading={`Manage your resort bookings and view insights with ${APP_DEFAULT_NAME}.`}
      />
    </React.Fragment>
  )
}

export default Dashboard