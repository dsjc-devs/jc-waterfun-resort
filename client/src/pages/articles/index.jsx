import { Box, Container } from '@mui/material'
import { useGetMarketingMaterials } from 'api/marketing-materials'
import { useNavigate } from 'react-router'

import Banner from 'components/Banner'
import PageTitle from 'components/PageTitle'
import React from 'react'
import ArticleList from 'sections/dynamic-pages/ArticleList'
import banner from 'assets/images/upload/faqs-header.jpg'
import Hero from 'sections/landing-pages/Hero'
import bgImg from "assets/images/upload/our-mission.jpg";


const Articles = () => {
  const { data, isLoading } = useGetMarketingMaterials({ status: "POSTED" })
  const articles = data?.marketingMaterials || []

  const navigate = useNavigate()


  return (
    <React.Fragment>
      <PageTitle isOnportal={false} title="Articles" />

      <Banner
        title='Articles'
        subtitle='Explore our latest news, tips, and stories about JC Waterfun Resort.'
        image={banner}
      />

      <Container maxWidth="lg">
        <Box sx={{ my: 4, px: { xs: 0, md: 2 } }} >
          <ArticleList articles={articles} isOnPortal={false} />
        </Box>
      </Container>

      <Hero
        backgroundImage={bgImg}
        buttonConfigs={{
          label: "Book Now",
          action: () => {
            navigate('/book-now')
          }
        }}
      />
    </React.Fragment>
  )
}

export default Articles