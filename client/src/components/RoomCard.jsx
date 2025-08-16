import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack, Button } from '@mui/material';
import { UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import textFormatter from 'utils/textFormatter';

const RoomCard = ({ roomData, onView, onEdit, onDelete, isOnPortal = true }) => {
  const { thumbnail, name, description, capacity, price, type, status } = roomData;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
        position: 'relative'
      }}
    >
      {isOnPortal && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <Chip
            color={{
              ARCHIVED: 'error',
              POSTED: 'success'
            }[status]}
            label={status}
          />
        </Box>
      )}
      <CardMedia component="img" height="200" image={thumbnail} alt={name} />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography gutterBottom variant="h6" component="div">
            {name}
          </Typography>
          <Chip label={textFormatter.fromSlug(type)} color="primary" size="small" />
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={1}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.6em',
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <UserOutlined style={{ marginRight: 4 }} />
            <Typography variant="body2">{capacity} pax</Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>
              ₱
            </Typography>
            <Typography variant="body2">{price.day} / day</Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 500, mr: 1 }}>
              ₱
            </Typography>
            <Typography variant="body2">{price.night} / night</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            fullWidth
            onClick={onView}
            startIcon={<EyeOutlined />}
          >
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            color="info"
            fullWidth
            onClick={onEdit}
            startIcon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            fullWidth
            onClick={onDelete}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
