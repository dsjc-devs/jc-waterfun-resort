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
        boxShadow: 2,
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)'
        }
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: 0, paddingTop: '60%' }}>
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
            objectFit: 'cover',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
        />
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
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.85)',
            color: 'text.primary',
            px: 1.2,
            py: 0.4,
            borderRadius: 2,
            fontSize: '0.8rem',
            fontWeight: 500,
            boxShadow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <EyeOutlined style={{ fontSize: 15, marginRight: 4 }} />
          {material.views || 0}
        </Box>
      </Box>

      <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 0.5 }}>
          {material.title}
        </Typography>
        {material.excerpt && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
            {material.excerpt}
          </Typography>
        )}

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
              Read More
            </Typography>
          )}
        </Stack>

        {isOnPortal && (
          <Stack direction="row" spacing={1.5} sx={{ mt: 'auto', '& .MuiButton-root': { borderRadius: 1.5, fontSize: 13, px: 2.2, py: 0.65, minWidth: 92, textTransform: 'none' } }}>
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