import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useGetAmenities } from 'api/amenities';

import PageTitle from 'components/PageTitle';
import textFormatter from 'utils/textFormatter';
import Banner from 'components/Banner';

import banner from 'assets/images/upload/banner.jpg';
import AmenitySection from 'sections/landing-pages/AmenitySection';
import AmenityTypePage from 'sections/dynamic-pages/AmenityTypePage';

const Amenities = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const [page, setPage] = useState(1);
  const limit = 3;

  const { data, isLoading } = useGetAmenities({
    type,
    page,
    limit,
    status: "POSTED"
  });

  const { amenities = [], totalPages = 0, totalAmenities } = data || {};
  const pageCount = totalPages;

  const isEmpty = !isLoading && amenities?.length === 0;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',

    });
  }, [amenities]);

  return (
    <React.Fragment>
      <PageTitle title={`Amenities - ${textFormatter.fromSlug(type)}`} />

      <Banner
        image={banner}
        title={textFormatter.fromSlug(type)}
        subtitle="Amenities"
      />


      {!type && (
        <AmenityTypePage />
      )}

      {type && (
        <AmenitySection
          isLoading={isLoading}
          isEmpty={isEmpty}
          amenities={amenities}
          pageCount={pageCount}
          page={page}
          setPage={setPage}
          totalAmenities={totalAmenities}
          type={type}
        />
      )}
    </React.Fragment>
  );
};

export default Amenities;