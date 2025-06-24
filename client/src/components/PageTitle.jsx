import React from 'react';
import { APP_DEFAULT_NAME } from 'config/config';
import { Helmet } from 'react-helmet';

const PageTitle = ({ title, isOnportal = true }) => {
  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${title} - ${isOnportal ? `${APP_DEFAULT_NAME} Portal` : `${APP_DEFAULT_NAME}`}`}</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
    </React.Fragment>
  );
};

export default PageTitle;
