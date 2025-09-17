import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material'
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
                    <Box>
                        {article.thumbnail && (
                            <Box sx={{ mb: 2 }}>
                                <Avatar
                                    variant="rectangle"
                                    src={article.thumbnail}
                                    alt={article.title}
                                    sx={{
                                        width: '100%',
                                        height: 400,
                                        objectFit: 'cover',
                                        borderRadius: 2
                                    }}
                                />
                            </Box>
                        )}

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            {isOnPortal && (
                                <Chip
                                    label={article.status || 'N/A'}
                                    variant="filled"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        fontWeight: 500,
                                        textTransform: 'capitalize',
                                        borderRadius: '4px',
                                        px: 1.5,
                                        py: 0.5
                                    }}
                                />
                            )}

                            <Typography variant="body2" color="text.secondary">
                                Views: {article.views ?? 0}
                            </Typography>
                        </Stack>

                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {article.title}
                        </Typography>

                        {article.createdAt && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <ConvertDate dateString={article.createdAt} />
                            </Typography>
                        )}

                        {article.tags?.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
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
                        <Box marginBlock={5}>
                            <Box dangerouslySetInnerHTML={{ __html: article.content }} />
                        </Box>
                    </Box>
                ))}
        </React.Fragment>
    )
}

export default ArticleDetails