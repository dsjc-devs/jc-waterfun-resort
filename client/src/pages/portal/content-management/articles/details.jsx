import { useParams } from 'react-router';
import { useGetSingleMarketingMaterial } from 'api/marketing-materials';
import { APP_DEFAULT_PATH } from 'config/config';

import React from 'react';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import ArticleDetails from 'sections/portal/modules/articles/Details';

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const { data: material, isLoading } = useGetSingleMarketingMaterial(id);

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Articles', to: '/portal/content-management/articles' },
    { title: 'View' }
  ];

  return (
    <React.Fragment>
      <PageTitle title={material?.title || 'Article Details'} />
      <Breadcrumbs
        custom
        heading=" Article Details"
        links={breadcrumbLinks}
        subheading="View article details and information."
      />

      <ArticleDetails article={material} isLoading={isLoading} isOnPortal={true} />
    </React.Fragment>
  );
};

export default ArticleDetailsPage;
