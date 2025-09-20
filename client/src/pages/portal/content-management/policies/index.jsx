import Breadcrumbs from 'components/@extended/Breadcrumbs'
import PageTitle from 'components/PageTitle'
import { APP_DEFAULT_PATH } from 'config/config';
import React from 'react'
import PoliciesTable from 'sections/portal/modules/policies/Table';

const breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Content Management - Policies' },
];

const Policies = () => {
  return (
    <React.Fragment>
      <PageTitle title="Policies" />
      <Breadcrumbs
        custom
        heading="Policies"
        links={breadcrumbLinks}
        subheading="Manage the resort's policies information displayed on the website."
      />

      <PoliciesTable />
    </React.Fragment>
  )
}

export default Policies