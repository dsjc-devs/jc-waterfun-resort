import React from 'react'
import { APP_DEFAULT_PATH } from 'config/config';
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import CarouselList from 'sections/portal/modules/carousel-management/CarouselList';

let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Carousel Management' }
];

const carouselManagement = () => {
    return (
        <React.Fragment>
            <PageTitle title="Carousel Management" />

            <Breadcrumbs
                custom
                heading="Carousel Management"
                links={breadcrumbLinks}
                subheading="Manage the carousel images displayed on the homepage."
            />

            <CarouselList />
        </React.Fragment>
    )
}

export default carouselManagement;