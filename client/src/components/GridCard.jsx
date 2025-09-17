import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Button
} from '@mui/material';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
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

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
        <Avatar
          variant="rectangle"
          src={material.thumbnail}
          alt={material.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            px: 1,
            py: 0.3,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'medium'
          }}
        >
          <ConvertDate dateString={material.createdAt} />
        </Box>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {material.title}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
          {isOnPortal && (
            <Chip size="small" label={statusLabels[material.status]} color={statusColors[material.status] || 'default'} />
          )}
          {!isOnPortal && (
            <Typography
              variant="body2"
              color="primary"
              onClick={() => navigate(`/articles/details/${material._id}`)}
              sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              View Article
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Views: {material.views || 0}
          </Typography>
        </Stack>

        {isOnPortal && (
          <Stack direction="row" spacing={1.5} sx={{ '& .MuiButton-root': { borderRadius: 1.5, fontSize: 13, px: 2.2, py: 0.65, minWidth: 92, textTransform: 'none' } }}>
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
      </Box>
    </Box>
  );
}

export default GridCard;