import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Stack, Chip, Badge } from '@mui/material';
import { EditOutlined, DeleteOutlined, EyeOutlined, StarFilled } from '@ant-design/icons';
import useGetPosition from 'hooks/useGetPosition';
import textFormatter from 'utils/textFormatter';

const AmenityCard = ({ amenityData, onView, onEdit, onDelete, isOnPortal = false }) => {
  const { isCustomer } = useGetPosition();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fffe 100%)',
        boxShadow: (theme) => `0 8px 32px ${theme.palette.primary.main}08`,
        border: (theme) => `1px solid ${theme.palette.primary.main}05`,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        '&:hover': {
          boxShadow: (theme) => `0 20px 60px ${theme.palette.primary.main}15`,
          '& .amenity-overlay': {
            opacity: 1
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 240 }}>
        <CardMedia
          component="img"
          height="240"
          image={amenityData?.thumbnail || '/placeholder-image.jpg'}
          alt={amenityData?.name}
          className="amenity-image"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            width: '100%'
          }}
        />

        <Box
          className="amenity-overlay"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      </Box>

      <CardContent sx={{
        flexGrow: 1,
        p: 3,
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbff 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          noWrap
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'text.primary',
            mb: 1,
            letterSpacing: '-0.025em'
          }}
        >
          {amenityData?.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
            fontSize: '0.875rem'
          }}
        >
          {amenityData?.description}
        </Typography>

        {amenityData?.price && (
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              mb: 2
            }}
          >
            ₱{amenityData.price}
          </Typography>
        )}

        <Stack direction="row" mb={2}>
          {amenityData?.type && (
            <Chip
              label={textFormatter.fromSlug(amenityData.type)}
              size="small"
              color="primary"
              sx={{
                fontWeight: 600,
                fontSize: '10px',
                height: 24,
                '& .MuiChip-label': {
                  px: 1.5
                }
              }}
            />
          )}

          <Chip
            label={amenityData.status}
            size="small"
            color={{
              ARCHIVED: 'error',
              POSTED: 'success',
            }[amenityData.status] || "secondary"}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: '#fff',
              fontWeight: 600,
              fontSize: '11px',
            }}
          />
        </Stack>

        {isOnPortal && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            mt: 'auto',
            pt: 2
          }}>
            <IconButton
              size="small"
              onClick={onView}
              color="primary"
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.50',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => `0 8px 20px ${theme.palette.primary.main}40`
                },
                transition: 'all 0.3s ease'
              }}
            >
              <EyeOutlined style={{ fontSize: '14px' }} />
            </IconButton>

            {!isCustomer && (
              <>
                <IconButton
                  size="small"
                  onClick={onEdit}
                  color="info"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'info.50',
                    '&:hover': {
                      bgcolor: 'info.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 8px 20px ${theme.palette.info.main}40`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <EditOutlined style={{ fontSize: '14px' }} />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={onDelete}
                  color="error"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'error.50',
                    '&:hover': {
                      bgcolor: 'error.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 8px 20px ${theme.palette.error.main}40`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <DeleteOutlined style={{ fontSize: '14px' }} />
                </IconButton>
              </>
            )}
          </Box>
        )}
      </CardContent>

      <Box
        sx={{
          height: 4,
          bgcolor: 'primary.main',
          opacity: 0.8
        }}
      />
    </Card>
  );
};

export default AmenityCard;
