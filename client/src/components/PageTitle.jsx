import React from 'react';
import { useGetResortDetails } from 'api/resort-details';
import { Helmet } from 'react-helmet';

const PageTitle = ({ title, isOnportal = true }) => {

  const { resortDetails } = useGetResortDetails()

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${title} - ${isOnportal ? `${resortDetails?.companyInfo?.name} Portal` : `${resortDetails?.companyInfo?.name}`}`}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
    </React.Fragment>
  );
};

export default PageTitle;
