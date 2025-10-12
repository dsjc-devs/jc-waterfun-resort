import React from 'react'
import { APP_DEFAULT_PATH } from 'config/config';
import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Testimonials from 'sections/portal/modules/testomonials-customer/TestimonialList';

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
                subheading="Share your experience and help others discover JC Waterfun Resort."
            />

            <Testimonials />
        </React.Fragment>
    )
}

export default TestimonialsPage