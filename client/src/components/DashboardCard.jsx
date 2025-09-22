import React from 'react';
import { Box, Typography, Skeleton, Fade, useTheme } from '@mui/material';
import MainCard from 'components/MainCard';

const DashboardCard = ({
  title,
  value,
  icon,
  color = 'primary',
  isLoading = false,
  subtitle,
  details = [],
  gradient = false,
  trend = null,
  onClick
}) => {
  const theme = useTheme();

  const gradientColors = {
    primary: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    secondary: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
    success: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
    warning: 'linear-gradient(135deg, #ed6c02 0%, #ffb74d 100%)',
    error: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
    info: 'linear-gradient(135deg, #0288d1 0%, #4fc3f7 100%)',
  };

  return (
    <Fade in timeout={300}>
      <MainCard
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          background: gradient ? gradientColors[color] : 'inherit',
          color: gradient ? '#fff' : 'inherit',
          '&:hover': {
            transform: onClick ? 'translateY(-4px)' : 'none',
            boxShadow: onClick ? theme.shadows[8] : theme.shadows[1],
          },
          '&::before': gradient ? {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            transform: 'translate(30px, -30px)',
          } : {},
        }}
        onClick={onClick}
      >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mb: 1,
                color: gradient ? 'rgba(255,255,255,0.9)' : 'text.primary',
                fontSize: '0.875rem'
              }}
            >
              {title}
            </Typography>

            {isLoading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  mb: subtitle ? 1 : 0,
                  color: gradient ? '#fff' : 'text.primary',
                  lineHeight: 1.2
                }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
            )}

            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: gradient ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                  mb: details.length > 0 ? 1 : 0
                }}
              >
                {subtitle}
              </Typography>
            )}

            {details.length > 0 && (
              <Box mt={1.5}>
                {details.map((detail, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    mb={0.5}
                  >
                    {detail.icon}
                    <Typography
                      variant="caption"
                      sx={{
                        color: gradient ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                        fontSize: '0.75rem'
                      }}
                    >
                      {detail.label}: {isLoading ? <Skeleton width={30} component="span" /> : detail.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {trend && (
              <Box display="flex" alignItems="center" gap={1} mt={1}>
                {trend.icon}
                <Typography
                  variant="caption"
                  sx={{
                    color: trend.positive ?
                      (gradient ? 'rgba(255,255,255,0.9)' : 'success.main') :
                      (gradient ? 'rgba(255,255,255,0.9)' : 'error.main'),
                    fontWeight: 600
                  }}
                >
                  {trend.value}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : `${color}.light`,
              color: gradient ? '#fff' : `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: gradient ? 'blur(10px)' : 'none',
            }}
          >
            {icon}
          </Box>
        </Box>
      </MainCard>
    </Fade>
  );
};

export default DashboardCard;
