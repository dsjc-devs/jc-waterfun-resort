import { APP_DEFAULT_PATH } from 'config/config';

import React from 'react'
import Table from 'sections/portal/modules/marketing-materials/Table'
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs'

const breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Content Management - Marketing Materials' },
];

const MarketingMaterials = () => {
  return (
    <React.Fragment>
      <PageTitle title="Marketing Materials" />
      <Breadcrumbs
        custom
        heading="Marketing Materials"
        links={breadcrumbLinks}
        subheading="Manage the resort's marketing materials displayed on the website."
      />

      <Table />
    </React.Fragment>
  )
}

export default MarketingMaterials