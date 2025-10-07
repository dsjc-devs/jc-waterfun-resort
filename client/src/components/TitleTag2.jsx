import { Box, Typography } from '@mui/material';
import { useGetResortDetails } from 'api/resort-details';
import React from 'react';


const TitleTag = ({ title, subtitle, icon, color = '#634131' }) => {

  const { resortDetails } = useGetResortDetails()

  return (
    <React.Fragment>
      <Box justifyContent="center" display="flex" alignContent="center" alignItems="center" flexDirection="column" marginBottom={3}>
        <Box>
          {icon}
        </Box>
        <Typography variant="h2" fontSize={40} color={color} fontFamily="Cinzel">
          {title || resortDetails?.companyInfo?.name}
        </Typography>
        <Typography variant="h5" fontFamily="Istok Web" >
          {subtitle}
        </Typography>
      </Box>


    </React.Fragment>
  );
};

export default TitleTag;
