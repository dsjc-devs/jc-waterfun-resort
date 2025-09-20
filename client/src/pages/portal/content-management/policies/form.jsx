import Breadcrumbs from 'components/@extended/Breadcrumbs'
import PageTitle from 'components/PageTitle'
import { APP_DEFAULT_PATH } from 'config/config';
import React from 'react'
import Form from 'sections/portal/modules/policies/Form';

const PolicyForm = () => {
  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Content Management - Policies', to: '/portal/content-management/policies' },
    { title: 'Form' },
  ];

  return (
    <React.Fragment>
      <PageTitle title='Policy Form' />
      <Breadcrumbs
        custom
        heading="Policy Form"
        links={breadcrumbLinks}
        subheading="Add or edit a policy for the resort website."
      />

      <Form />
    </React.Fragment>
  )
}

export default PolicyForm