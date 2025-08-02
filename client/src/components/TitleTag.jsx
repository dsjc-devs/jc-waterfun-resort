import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { COMPANY_NAME } from 'constants/constants';

const TitleTag = ({ title, subtitle, icon }) => {
  return (
    <React.Fragment>
      <Box justifyContent="center" display="flex" alignContent="center" alignItems="center" flexDirection="column" marginBottom={3}>
        <Box>
          {icon}
        </Box>
        <Typography variant="h4" color="secondary">
          {subtitle || COMPANY_NAME}
        </Typography>
        <Typography variant="h1" fontWeight={900}>
          {title}
        </Typography>
      </Box>
      <Divider sx={{ width: 60, display: 'block', margin: ' 1em auto', marginTop: '-1em', borderBottom: 4 }} />

    </React.Fragment>
  );
};

export default TitleTag;
