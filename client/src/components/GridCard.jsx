import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  alpha,
  useTheme
} from '@mui/material';
import { EyeOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

import ConvertDate from 'components/ConvertDate';
import Avatar from 'components/@extended/Avatar';

const statusLabels = {
  POSTED: 'Posted',
  UNPUBLISHED: 'Unpublished',
  ARCHIVED: 'Archived'
};

const statusColors = {
  POSTED: 'primary',
  UNPUBLISHED: 'warning',
  ARCHIVED: 'error'
};

const GridCard = ({ material, isOnPortal = false, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'Discover the latest news and insights from our resort.';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
          '& .article-image': {
            transform: 'scale(1.05)',
          },
          '& .view-button': {
            opacity: 1,
            transform: 'translateY(0)',
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height={200}
          image={material.thumbnail || '/placeholder-article.jpg'}
          alt={material.title}
          className="article-image"
          sx={{
            transition: 'transform 0.3s ease',
            objectFit: 'cover'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'capitalize'
            }}
          >
            {material.type?.replace('-', ' ') || 'Article'}
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(0,0,0,0.55)',
            color: '#fff',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: 1
          }}
        >
          <ConvertDate dateString={material.createdAt} />
        </Box>

        {!isOnPortal && (
          <Button
            className="view-button"
            variant="contained"
            size="small"
            startIcon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/articles/details/${material._id}`);
            }}
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              opacity: 0,
              transform: 'translateY(10px)',
              transition: 'all 0.3s ease',
              borderRadius: 2,
              minWidth: 'auto',
              px: 2
            }}
          >
            Read
          </Button>
        )}
      </Box>

      <CardContent
        sx={{
          p: { xs: 2, md: 3 },
          '&:last-child': { pb: { xs: 2, md: 3 } },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
        onClick={() => !isOnPortal && navigate(`/articles/details/${material._id}`)}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Cinzel',
            fontWeight: 600,
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {material.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.875rem', md: '0.9rem' },
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            flexGrow: 1
          }}
        >
          {truncateText(material.content || material.excerpt)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarOutlined style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {formatDate(material.createdAt)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
              <EyeOutlined style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.75rem' }}
              >
                {material.views || 0}
              </Typography>
            </Box>
          </Box>

          {isOnPortal && (
            <Chip size="small" label={statusLabels[material.status]} color={statusColors[material.status] || 'default'} />
          )}
          {material.featured && !isOnPortal && (
            <Chip
              label="Featured"
              size="small"
              color="primary"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600
              }}
            />
          )}
        </Box>

        {isOnPortal && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 2, '& .MuiButton-root': { borderRadius: 1.5, fontSize: 13, px: 2.2, py: 0.65, minWidth: 92, textTransform: 'none' } }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<EyeOutlined style={{ fontSize: 14 }} />}
              onClick={() => navigate(`/portal/content-management/articles/details/${material._id}`)}
            >
              View
            </Button>
            <Button
              size="small"
              variant="contained"
              color="info"
              startIcon={<EditOutlined style={{ fontSize: 14 }} />}
              onClick={() => (onEdit ? onEdit(material) : navigate(`/portal/content-management/articles/form?id=${material._id}`))}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<DeleteOutlined style={{ fontSize: 14 }} />}
              onClick={() => onDelete && onDelete(material)}
            >
              Delete
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default GridCard;