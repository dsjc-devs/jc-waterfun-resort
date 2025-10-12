import React from 'react'
import { APP_DEFAULT_PATH } from 'config/config';
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Testimonials from 'sections/portal/modules/testimonials-admin/master-admin/TestimonialList';

let breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Testimonials' }
];

const TestimonialsPage = () => {
    return (
        <React.Fragment>
            <PageTitle title="Testimonials" />

            <Breadcrumbs
                custom
                heading="Testimonials"
                links={breadcrumbLinks}
                subheading="Handle testimonials displayed on the website."
            />

            <Testimonials />
        </React.Fragment>
    )
}

export default TestimonialsPage