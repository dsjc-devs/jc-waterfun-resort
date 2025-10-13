import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import { ArrowRightOutlined } from '@ant-design/icons';

const AccommodationTypeCard = ({
  type,
  count,
  typeImage,
  onViewType
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const formattedName = type.title || type?.name

  const handleViewType = () => {
    if (onViewType) {
      onViewType(type.slug);
    } else {
      navigate(`/accommodations?type=${type.slug}`);
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(32, 178, 170, 0.15), 0 4px 16px rgba(255, 107, 53, 0.1)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        height: { xs: 'auto', md: 550 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FF6B35 0%, #F7931E 25%, #20B2AA 50%, #4682B4 75%, #1E90FF 100%)',
          zIndex: 2
        },
        '&::after': {
          content: '"🌊"',
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '2rem',
          opacity: 0.1,
          zIndex: 1,
          transform: 'rotate(-15deg)'
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.01)',
          boxShadow: '0 20px 60px rgba(32, 178, 170, 0.25), 0 8px 32px rgba(255, 107, 53, 0.15)',
          '& .type-image': {
            transform: 'scale(1.08) rotate(1deg)'
          },
          '& .view-button': {
            background: 'linear-gradient(135deg, #FF6B35 0%, #20B2AA 100%)',
            transform: 'translateX(8px) scale(1.05)',
            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)'
          },
          '& .card-content': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(240, 253, 255, 0.98) 100%)'
          }
        }
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: { xs: '100%', md: '55%' },
          height: { xs: 300, md: '100%' },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {typeImage ? (
          <CardMedia
            component="img"
            image={typeImage}
            alt={formattedName}
            className="type-image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h2" sx={{ color: 'white', opacity: 0.8 }}>
              🏖️
            </Typography>
          </Box>
        )}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(32, 178, 170, 0.3) 0%, rgba(255, 107, 53, 0.2) 50%, rgba(30, 144, 255, 0.3) 100%)',
            opacity: 0.7,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Tropical Pattern Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3
          }}
        />

        {/* Available Count Chip */}
        <Chip
          label={`🏖️ ${count} Available`}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 220, 0.95) 100%)',
            backdropFilter: 'blur(15px)',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#FF6B35',
            border: '2px solid rgba(255, 107, 53, 0.2)',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.25)',
            '& .MuiChip-label': {
              px: 3,
              py: 0.8
            }
          }}
        />
      </Box>

      {/* Content Section */}
      <Box
        className="card-content"
        sx={{
          width: { xs: '100%', md: '45%' },
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 4, md: 5 },
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.95) 100%)',
          position: 'relative',
          '&::before': {
            content: '"🌺"',
            position: 'absolute',
            top: 20,
            right: 20,
            fontSize: '1.5rem',
            opacity: 0.1,
            transform: 'rotate(15deg)'
          }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(45deg, #FF6B35 0%, #20B2AA 50%, #4682B4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.9rem', md: '2.3rem' },
              letterSpacing: '-0.01em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {formattedName}
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              mb: 4,
              lineHeight: 1.9,
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              color: '#2C5F6F',
              fontWeight: 400,
              letterSpacing: '0.01em'
            }}
          >
            {type.description || `🌴 Immerse yourself in tropical luxury with our exquisite ${formattedName?.toLowerCase()}. Each accommodation features world-class amenities, stunning ocean views, and direct access to pristine beaches. Experience the ultimate island getaway where paradise meets comfort.`}
          </Typography>

          {/* Stats Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(135deg, rgba(32, 178, 170, 0.08) 0%, rgba(255, 107, 53, 0.05) 50%, rgba(30, 144, 255, 0.08) 100%)',
              borderRadius: 4,
              border: '2px solid rgba(32, 178, 170, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #20B2AA 0%, #FF6B35 50%, #1E90FF 100%)'
              }
            }}
          >
            <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    background: 'linear-gradient(45deg, #FF6B35 0%, #20B2AA 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {count}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C5F6F' }}>
                  🏖️Units
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  🌟
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2C5F6F' }}>
                  Luxury Experience
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* CTA Button */}
        <Button
          className="view-button"
          variant="contained"
          size="large"
          endIcon={<ArrowRightOutlined />}
          onClick={handleViewType}
          sx={{
            py: 2.5,
            px: 6,
            borderRadius: 50,
            background: 'linear-gradient(135deg, #20B2AA 0%, #FF6B35 50%, #1E90FF 100%)',
            fontWeight: 700,
            fontSize: '1.2rem',
            textTransform: 'capitalize',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 6px 25px rgba(32, 178, 170, 0.4)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              transition: 'left 0.6s'
            },
            '&:hover::before': {
              left: '100%'
            },
            '&:hover': {
              boxShadow: '0 8px 30px rgba(32, 178, 170, 0.5)',
              background: 'linear-gradient(135deg, #FF6B35 0%, #20B2AA 50%, #4682B4 100%)'
            }
          }}
        >
          🏝️ Explore {formattedName}
        </Button>
      </Box>
    </Card>
  );
};

export default AccommodationTypeCard;