import React from 'react';
import { useParams } from 'react-router';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Skeleton
} from '@mui/material';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import ScrollTop from 'components/ScrollTop';
import { APP_DEFAULT_PATH } from 'config/config';
import Avatar from 'components/@extended/Avatar';
import ConvertDate from 'components/ConvertDate';
import { useGetSingleMarketingMaterial } from 'api/marketing-materials';
import MainCard from 'components/MainCard';

const MarketingMaterialDetails = () => {
  const { id } = useParams();
  const { data: material, isLoading } = useGetSingleMarketingMaterial(id);

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Marketing Materials', to: '/portal/content-management/marketing-materials' },
    { title: 'View' }
  ];

  return (
    <>
      <ScrollTop />
      <PageTitle title={material?.title || 'Marketing Material'} />

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
        </MainCard>
      ) : (
        material && (
          <Box>
            {material.thumbnail && (
              <Box sx={{ mb: 2 }}>
                <Avatar
                  variant="rectangle"
                  src={material.thumbnail}
                  alt={material.title}
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
              <Chip
                label={material.status || 'N/A'}
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

              <Typography variant="body2" color="text.secondary">
                Views: {material.views ?? 0}
              </Typography>
            </Stack>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {material.title}
            </Typography>

            {material.createdAt && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <ConvertDate dateString={material.createdAt} />
              </Typography>
            )}

            {material.tags?.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
                {material.tags.map((tag, index) => (
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
            <MainCard>
              <Box marginBlock={5}>
                <Box dangerouslySetInnerHTML={{ __html: material.content }} />
              </Box>
            </MainCard>
          </Box>
        )
      )}
    </>
  );
};

export default MarketingMaterialDetails;
