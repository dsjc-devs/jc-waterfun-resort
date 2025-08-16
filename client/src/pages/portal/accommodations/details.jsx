import { useGetSingleAccommodation } from 'api/accommodations';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import Loader from 'components/Loader';
import PageTitle from 'components/PageTitle';
import ScrollTop from 'components/ScrollTop';
import { APP_DEFAULT_PATH } from 'config/config';
import React from 'react';
import { useParams } from 'react-router';
import AccommodationPage from 'sections/dynamic-pages/AccommodationPage';
import textFormatter from 'utils/textFormatter';

const AccommodationDetails = () => {
  const { id } = useParams(":id")

  const { data, isLoading } = useGetSingleAccommodation(id)
  const {
    name,
    type,
  } = data || {}

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: `${textFormatter.fromSlug(type)}`, to: `/portal/accommodations?type=${type}` },
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
        subheading="See the details of the accommodation created."
      />

      <AccommodationPage data={data} isLoading={isLoading} />
    </React.Fragment>
  );
};

export default AccommodationDetails;
