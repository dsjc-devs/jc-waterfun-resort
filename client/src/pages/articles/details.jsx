import { Container, Box, IconButton, Typography, Card, CardContent, Avatar, Tooltip } from '@mui/material'
import { useParams, useNavigate } from 'react-router'
import { useGetSingleMarketingMaterial, useGetMarketingMaterials } from 'api/marketing-materials'
import MarketingMaterials from 'api/marketing-materials'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

import React, { useEffect, useState } from 'react'
import PageTitle from 'components/PageTitle'
import ArticleDetailsPage from 'sections/portal/modules/articles/Details'

const ArticleDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data = {}, isLoading, mutate } = useGetSingleMarketingMaterial(id)
    const { data: articlesData } = useGetMarketingMaterials({ status: "POSTED" })

    const [currentIndex, setCurrentIndex] = useState(-1)
    const articles = articlesData?.marketingMaterials || []

    // Find current article index
    useEffect(() => {
        if (articles.length > 0 && id) {
            const index = articles.findIndex(article => article._id === id)
            setCurrentIndex(index)
        }
    }, [articles, id])

    useEffect(() => {
        const incrementView = async () => {
            if (id && !isLoading) {
                try {
                    await MarketingMaterials.incrementView(id);
                    mutate();
                } catch (error) {
                    console.error('Failed to increment view:', error);
                }
            }
        };

        incrementView();
    }, [id, isLoading, mutate]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevArticle = articles[currentIndex - 1]
            navigate(`/articles/details/${prevArticle._id}`)
        }
    }

    const handleNext = () => {
        if (currentIndex < articles.length - 1) {
            const nextArticle = articles[currentIndex + 1]
            navigate(`/articles/details/${nextArticle._id}`)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <React.Fragment>
            <PageTitle isOnportal={false} title="Article Details" />

            <Container sx={{ my: 4 }}>
                <ArticleDetailsPage article={data} isLoading={isLoading} />

                {/* Article Navigation Carousel */}
                {articles.length > 1 && currentIndex !== -1 && (
                    <Box sx={{ mt: 6, mb: 4 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 3,
                                textAlign: 'center',
                                fontFamily: 'Cinzel',
                                fontWeight: 600,
                                color: 'primary.main'
                            }}
                        >
                            Continue Reading
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            justifyContent: 'center'
                        }}>
                            {/* Previous Article */}
                            <Box sx={{ flex: 1, maxWidth: 400 }}>
                                {currentIndex > 0 && (
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4
                                            }
                                        }}
                                        onClick={handlePrevious}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'primary.dark' }
                                                    }}
                                                >
                                                    <LeftOutlined />
                                                </IconButton>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Previous Article
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {articles[currentIndex - 1].title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(articles[currentIndex - 1].createdAt)}
                                                    </Typography>
                                                </Box>
                                                {articles[currentIndex - 1].thumbnail && (
                                                    <Avatar
                                                        src={articles[currentIndex - 1].thumbnail}
                                                        alt={articles[currentIndex - 1].title}
                                                        sx={{ width: 50, height: 50 }}
                                                    />
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>

                            {/* Current Article Indicator */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: 120
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {currentIndex + 1} of {articles.length}
                                </Typography>
                                <Box sx={{
                                    width: 60,
                                    height: 4,
                                    bgcolor: 'primary.main',
                                    borderRadius: 2
                                }} />
                            </Box>

                            {/* Next Article */}
                            <Box sx={{ flex: 1, maxWidth: 400 }}>
                                {currentIndex < articles.length - 1 && (
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4
                                            }
                                        }}
                                        onClick={handleNext}
                                    >
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {articles[currentIndex + 1].thumbnail && (
                                                    <Avatar
                                                        src={articles[currentIndex + 1].thumbnail}
                                                        alt={articles[currentIndex + 1].title}
                                                        sx={{ width: 50, height: 50 }}
                                                    />
                                                )}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Next Article
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}
                                                    >
                                                        {articles[currentIndex + 1].title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(articles[currentIndex + 1].createdAt)}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        '&:hover': { bgcolor: 'primary.dark' }
                                                    }}
                                                >
                                                    <RightOutlined />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Container>
        </React.Fragment >
    )
}

export default ArticleDetails