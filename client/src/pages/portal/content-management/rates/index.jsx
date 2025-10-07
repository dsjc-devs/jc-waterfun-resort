import { APP_DEFAULT_PATH } from 'config/config';


import React from 'react'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import ResortRates from 'sections/portal/modules/rates/Rates'

const Rates = () => {
  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Content Management - Resort Rates' },
  ];

  return (
    <React.Fragment>
      <PageTitle title="Resort Rates" />
      <Breadcrumbs
        custom
        heading="Resort Rates"
        links={breadcrumbLinks}
        subheading="Manage the resort's rates information displayed on the website."
      />

      <ResortRates />
    </React.Fragment>
  )
}

export default Rates