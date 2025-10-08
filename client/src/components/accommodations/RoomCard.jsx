import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack, Button, alpha, useTheme } from '@mui/material';
import { UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined, StarFilled, ClockCircleOutlined } from '@ant-design/icons';
import textFormatter from 'utils/textFormatter';
import { NO_CATEGORY } from 'constants/constants';
import useGetPosition from 'hooks/useGetPosition';

const RoomCard = ({
  roomData,
  onView,
  onEdit,
  onDelete,
  isOnPortal = true,
  variant = "compact",
  showFeaturedBadge = true,
  index = 0
}) => {
  const { thumbnail, name, description, capacity, price, type, status, isFeatured, maxStayDuration, hasPoolAccess } = roomData;
  const { isCustomer } = useGetPosition();
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: variant === "featured" ? 4 : 3,
        overflow: 'hidden',
        boxShadow: variant === "featured"
          ? '0 8px 32px rgba(0, 0, 0, 0.12)'
          : '0 4px 16px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        background: theme.palette.background.paper,
        '&:hover': {
          transform: variant === "featured" ? 'translateY(-8px)' : 'translateY(-4px)',
          boxShadow: variant === "featured"
            ? '0 20px 40px rgba(0, 0, 0, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.15)',
        }
      }}
      data-aos={variant === "featured" ? "fade-up" : undefined}
      data-aos-delay={variant === "featured" ? index * 200 : undefined}
    >
      {/* Status Badge for Portal */}
      {(isOnPortal && !isCustomer) && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2
          }}
        >
          <Chip
            color={{
              ARCHIVED: 'error',
              POSTED: 'success',
            }[status] || "secondary"}
            label={status}
            size="small"
          />
        </Box>
      )}

      {/* Featured Badge */}
      {showFeaturedBadge && isFeatured && (
        <Box
          sx={{
            position: 'absolute',
            top: variant === "featured" ? 16 : 8,
            right: variant === "featured" ? 16 : 8,
            zIndex: 2,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: 'white',
            px: variant === "featured" ? 2 : 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: variant === "featured" ? '0.75rem' : '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.4)'
          }}
        >
          <StarFilled style={{ fontSize: variant === "featured" ? '12px' : '10px' }} />
          FEATURED
        </Box>
      )}

      {/* Image */}
      <CardMedia
        component="img"
        height={variant === "featured" ? "250" : "200"}
        image={thumbnail || '/placeholder-image.jpg'}
        alt={name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />

      <CardContent sx={{ p: variant === "featured" ? 3 : 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Type Badge */}
        {textFormatter.fromSlug(type) !== NO_CATEGORY && (
          <Chip
            label={textFormatter.fromSlug(type)}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mb: 2,
              background: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        )}

        {/* Title */}
        <Typography
          variant={variant === "featured" ? "h5" : "h6"}
          component="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: theme.palette.text.primary,
            lineHeight: 1.3
          }}
        >
          {name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: variant === "featured" ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            height: variant === "featured" ? '4.5em' : '3em', // Fixed height instead of minHeight
            flexShrink: 0 // Prevent shrinking
          }}
        >
          {description}
        </Typography>

        {/* Details */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mb: 3,
            height: '1.5em', // Fixed height for details section
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <UserOutlined style={{ fontSize: '14px', color: theme.palette.text.secondary }} />
            <Typography variant="caption" color="text.secondary">
              {capacity} guests
            </Typography>
          </Box>
          {maxStayDuration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ClockCircleOutlined style={{ fontSize: '14px', color: theme.palette.text.secondary }} />
              <Typography variant="caption" color="text.secondary">
                {maxStayDuration}h max
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Pricing */}
        <Box
          sx={{
            mb: 3,
            height: variant === "featured" ? '3.5em' : '3em', // Fixed height for pricing section
            flexShrink: 0
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box>
              <Typography
                variant={variant === "featured" ? "h6" : "subtitle2"}
                color="primary"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                ₱{price.day.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                per day
              </Typography>
            </Box>
            <Box>
              <Typography
                variant={variant === "featured" ? "h6" : "subtitle2"}
                color="primary"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                ₱{price.night.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                per night
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Pool Access */}
        <Box
          sx={{
            height: '2em', // Fixed height for pool access section
            mb: 2,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-start'
          }}
        >
          {hasPoolAccess && (
            <Chip
              label="🏊‍♂️ Pool Access Included"
              size="small"
              sx={{
                background: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          )}
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            fullWidth
            onClick={onView}
            startIcon={<EyeOutlined />}
            sx={{
              py: variant === "featured" ? 1.5 : 1,
              borderRadius: 2,
              background: variant === "featured"
                ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                : undefined,
              fontWeight: 600,
              textTransform: 'capitalize',
              boxShadow: variant === "featured"
                ? '0 4px 15px rgba(25, 118, 210, 0.3)'
                : undefined,
              '&:hover': variant === "featured" ? {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              } : undefined
            }}
          >
            {variant === "featured" ? "View Details" : "View"}
          </Button>
          {(!isCustomer && isOnPortal) && (
            <React.Fragment>
              <Button
                variant="contained"
                size="small"
                color="info"
                fullWidth
                onClick={onEdit}
                startIcon={<EditOutlined />}
                sx={{
                  py: variant === "featured" ? 1.5 : 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
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
                sx={{
                  py: variant === "featured" ? 1.5 : 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'capitalize'
                }}
              >
                Delete
              </Button>
            </React.Fragment>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
