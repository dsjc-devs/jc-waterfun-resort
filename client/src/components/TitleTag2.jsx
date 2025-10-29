import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useGetResortDetails } from 'api/resort-details';


const TitleTag = ({ title, subtitle, icon, color = '#634131' }) => {
  const theme = useTheme()
  const { resortDetails } = useGetResortDetails()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mb={{ xs: 2, sm: 3, md: 4 }}
      px={{ xs: 2, sm: 0 }}
      textAlign="center"
    >
      <Box sx={{ mb: { xs: 1, sm: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon && React.isValidElement(icon)
          ? React.cloneElement(icon, {
            sx: {
              fontSize: { xs: '1.6rem', sm: '2rem', md: '2.4rem' },
              color,
            },
          })
          : icon}
      </Box>

      <Typography
        component="h2"
        variant="h2"
        sx={{
          fontFamily: 'Cinzel',
          color,
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem', lg: '3rem' },
          lineHeight: 1.05,
          fontWeight: 600,
        }}
      >
        {title || resortDetails?.companyInfo?.name}
      </Typography>

      {subtitle && (
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Istok Web',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
            mt: { xs: 0.5, sm: 1 },
            color: 'text.secondary',
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

export default TitleTag;
