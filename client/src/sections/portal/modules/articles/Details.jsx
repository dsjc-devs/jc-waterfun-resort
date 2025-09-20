import { Box, Chip, Skeleton, Stack, Typography, Divider, Paper } from '@mui/material'
import { useGetSingleMarketingMaterial } from 'api/marketing-materials'
import { useParams } from 'react-router'

import React from 'react'
import Avatar from 'components/@extended/Avatar'
import ConvertDate from 'components/ConvertDate'
import MainCard from 'components/MainCard'

const ArticleDetails = ({ article = {}, isLoading = false, isOnPortal = false }) => {
    const { id } = useParams();
    const { data: material } = useGetSingleMarketingMaterial(id);

    return (
        <React.Fragment>
            {isLoading ? (
                <MainCard>
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2, borderRadius: 2 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Skeleton variant="rounded" width={80} height={32} />
                        <Skeleton variant="text" width={40} />
                    </Stack>
                    <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                        <Skeleton variant="rounded" width={60} height={24} />
                        <Skeleton variant="rounded" width={60} height={24} />
                        <Skeleton variant="rounded" width={60} height={24} />
                    </Stack>
                    <Skeleton variant="rectangular" width="100%" height={120} />
                </MainCard >
            ) : (
                material && (
                    <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                        {article.thumbnail && (
                            <Box sx={{ width: '100%', height: { xs: 220, md: 400 }, overflow: 'hidden' }}>
                                <Avatar
                                    variant="rectangle"
                                    src={article.thumbnail}
                                    alt={article.title}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 0
                                    }}
                                />
                            </Box>
                        )}

                        <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 3, md: 5 } }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                {isOnPortal && (
                                    <Chip
                                        label={article.status || 'N/A'}
                                        variant="filled"
                                        color="primary"
                                        size="small"
                                        sx={{
                                            fontWeight: 500,
                                            textTransform: 'capitalize',
                                            borderRadius: '6px',
                                            px: 1.5,
                                            py: 0.5
                                        }}
                                    />
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    Views: {article.views ?? 0}
                                </Typography>
                            </Stack>

                            <Typography
                                variant="h3"
                                fontWeight={800}
                                align="center"
                                gutterBottom
                                sx={{ mb: 1, letterSpacing: 0.5 }}
                            >
                                {article.title}
                            </Typography>

                            {article.excerpt && (
                                <Typography
                                    variant="subtitle1"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ mb: 2, fontStyle: 'italic', maxWidth: 600, mx: 'auto' }}
                                >
                                    {article.excerpt}
                                </Typography>
                            )}

                            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                {article.createdAt && (
                                    <Typography variant="body2" color="text.secondary">
                                        <ConvertDate dateString={article.createdAt} />
                                    </Typography>
                                )}
                                {article.tags?.length > 0 && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {article.tags.map((tag, index) => (
                                            <Chip
                                                key={index}
                                                label={tag}
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Stack>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ maxWidth: 800, mx: 'auto', fontSize: '1.15rem', lineHeight: 1.8 }}>
                                <Box dangerouslySetInnerHTML={{ __html: article.content }} />
                            </Box>
                        </Box>
                    </Paper>
                )
            )}
        </React.Fragment>
    )
}

export default ArticleDetails