import React from 'react'

import { APP_DEFAULT_PATH } from 'config/config'

import PageTitle from 'components/PageTitle'
import Breadcrumbs from 'components/@extended/Breadcrumbs'

import Table from 'sections/portal/modules/faqs/Table'


const FAQs = () => {
    const breadcrumbLinks = [
        { title: 'Home', to: APP_DEFAULT_PATH },
        { title: 'Content Management - FAQs' },
    ];
    return (
        <React.Fragment>
            <PageTitle title="FAQs" />
            <Breadcrumbs
                custom
                heading="FAQs"
                links={breadcrumbLinks}
                subheading="Manage the resort's FAQs information displayed on the website."
            />
            <Table />
        </React.Fragment>
    )
}

export default FAQs;