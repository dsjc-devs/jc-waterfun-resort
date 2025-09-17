import { APP_DEFAULT_PATH } from 'config/config';

import React from 'react'
import Table from 'sections/portal/modules/articles/Table'
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs'

const breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Articles' },
];

const Articles = () => {
  return (
    <React.Fragment>
      <PageTitle title="Articles" />
      <Breadcrumbs
        custom
        heading="Articles"
        links={breadcrumbLinks}
        subheading="Manage the resort's articles displayed on the website."
      />

      <Table />
    </React.Fragment>
  )
}

export default Articles;