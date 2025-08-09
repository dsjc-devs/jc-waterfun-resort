import React from 'react'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import PageTitle from 'components/PageTitle'
import { APP_DEFAULT_PATH } from 'config/config';
import { useGetSingleUser } from 'api/users';
import { useParams } from 'react-router';
import Details from 'sections/portal/modules/customers/Details';

const CustomerDetails = () => {
  const { id } = useParams()
  const { user, isLoading, mutate } = useGetSingleUser(id)

  const { firstName, lastName } = user || {}

  let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Customers', to: '/portal/customers' },
    { title: 'Details' }
  ];

  return (
    <React.Fragment>
      <PageTitle title={`${firstName} ${lastName}`} />

      <Breadcrumbs
        custom
        heading="Customer Details"
        links={breadcrumbLinks}
        subheading={`Viewing details for customer ID: ${id}`}
      />

      <Details isLoading={isLoading} user={user} mutate={mutate} />
    </React.Fragment>
  )
}

export default CustomerDetails