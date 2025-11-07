import { useGetSingleAmenity } from 'api/amenities'
import { useParams } from 'react-router'
import { APP_DEFAULT_PATH } from 'config/config'

import React from 'react'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard'
import Loader from 'components/Loader'
import PageTitle from 'components/PageTitle'
import ScrollTop from 'components/ScrollTop'
import AmenityPage from 'sections/dynamic-pages/AmenityPage'
import textFormatter from 'utils/textFormatter'

const AmenityDetails = () => {
  const { id } = useParams(":id");

  const { data, isLoading } = useGetSingleAmenity(id);
  const {
    name,
    type,
  } = data || {};

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: `${textFormatter.fromSlug(type)}`, to: `/portal/amenities?type=${type}` },
    { title: `Details` },
  ];

  return (
    <React.Fragment>
      <ScrollTop />
      <PageTitle title={name} />

      {(isLoading) && (
        <React.Fragment>
          <Loader />
          <EmptyUserCard title='Loading...' />
        </React.Fragment>
      )}

      <Breadcrumbs
        custom
        heading={`${textFormatter.fromSlug(type)}`}
        links={breadcrumbLinks}
        subheading="See the details of the amenity created."
      />

      <AmenityPage data={data} isLoading={isLoading} isOnPortal={true} />
    </React.Fragment>
  )
}

export default AmenityDetails