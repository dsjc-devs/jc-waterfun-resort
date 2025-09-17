import { Container } from '@mui/material'
import { useParams } from 'react-router'
import { useGetSingleMarketingMaterial } from 'api/marketing-materials'

import React from 'react'
import PageTitle from 'components/PageTitle'
import ArticleDetailsPage from 'sections/portal/modules/articles/Details'

const ArticleDetails = () => {
    const { id } = useParams()
    const { data = {}, isLoading } = useGetSingleMarketingMaterial(id)

    return (
        <React.Fragment>
            <PageTitle isOnportal={false} title="Article Details" />

            <Container sx={{ my: 4 }}>
                <ArticleDetailsPage article={data} isLoading={isLoading} />
            </Container>
        </React.Fragment >
    )
}

export default ArticleDetails