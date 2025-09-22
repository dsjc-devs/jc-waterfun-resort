import { APP_DEFAULT_PATH } from 'config/config';
import React from 'react';
import PageTitle from 'components/PageTitle';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import GalleryList from 'components/GalleryList';

const breadcrumbLinks = [
  { title: 'Home', to: APP_DEFAULT_PATH },
  { title: 'Gallery' },
];

const Gallery = () => {
  return (
    <React.Fragment>
      <PageTitle title="Gallery" />
      <Breadcrumbs
        custom
        heading="Gallery"
        links={breadcrumbLinks}
        subheading="Manage the resort's gallery displayed on the website."
      />

      <GalleryList isOnPortal={true} />
    </React.Fragment>
  )
}

export default Gallery;