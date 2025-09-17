import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Container,
} from '@mui/material';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useGetResortRates } from 'api/resort-rates';

import TitleTag2 from 'components/TitleTag2';

const RateSection = () => {

  const { resortRates, isLoading } = useGetResortRates();
  const [mode, setMode] = useState('day');
  const [selectedDate,] = useState(null);
  const handleModeChange = (event, newMode) => {
    if (newMode !== null) setMode(newMode);
  };

  const adultRate = resortRates?.entranceFee?.adult?.[mode];
  const childRate = resortRates?.entranceFee?.child?.[mode];
  const pwdSeniorRate = resortRates?.entranceFee?.pwdSenior?.[mode];

  return (
    <React.Fragment>
      <Box sx={{ backgroundColor: '#f4e8cf', paddingBlock: 5 }}>
        {isLoading ? (
          <Box textAlign="center" mb={3}>
            <Skeleton variant="text" width={300} height={50} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={500} height={30} sx={{ mx: 'auto' }} />
          </Box>
        ) : (
          <TitleTag2
            title="Resort Rates"
            subtitle="Check out our rates in day and night"
          />
        )}
        <Box textAlign="center" marginBlock={4}>
          {isLoading ? (
            <Skeleton variant="rectangular" width={400} height={50} sx={{ mx: 'auto', borderRadius: 2 }} />
          ) : (
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleModeChange}
              aria-label="time of day selection"
              sx={{
                borderRadius: 8,
                background: '#fff',
                boxShadow: 'none',
                p: 0.5,
                mb: 3,
                border: '1px solid #e0e0e0',
                display: 'inline-flex',
                gap: 1,
              }}
            >
              <ToggleButton
                value="day"
                aria-label="day mode"
                disabled={selectedDate && isDateBlocked(selectedDate, 'day')}
                sx={{
                  borderRadius: 8,
                  px: 2,
                  py: 1,
                  mx: 0.5,
                  backgroundColor: mode === 'day' ? '#e8f5fd' : '#fff',
                  color: '#004b80',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  border: 'none',
                  boxShadow: 'none',
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: '#e8f5fd',
                  },
                }}
              >
                <SunOutlined style={{ marginRight: 6, color: '#f9d976', fontSize: 20 }} />
                Day Tour
              </ToggleButton>
              <ToggleButton
                value="night"
                aria-label="night mode"
                disabled={selectedDate && isDateBlocked(selectedDate, 'night')}
                sx={{
                  borderRadius: 8,
                  px: 2,
                  py: 1,
                  mx: 0.5,
                  backgroundColor: mode === 'night' ? '#e8f5fd' : '#fff',
                  color: '#004b80',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  border: 'none',
                  boxShadow: 'none',
                  transition: 'background 0.2s',
                  '&:hover': {
                    backgroundColor: '#e8f5fd',
                  },
                }}
              >
                <MoonOutlined style={{ marginRight: 6, color: '#2a93c1', fontSize: 20 }} />
                Night Tour
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>

        <Container>
          <Grid
            container
            marginBlock={5}
            textAlign="center"
          >
            {[0, 1].map((i) => (
              <Grid
                item
                xs={12}
                sm={6}
                key={i}
                data-aos={i === 0 ? "fade-right" : "fade-left"}
                sx={{
                  backgroundColor: i === 0 ? '#2a93c1' : '#f29023',
                  border: '1px solid #eee',
                  p: 10,
                }}
              >
                {isLoading ? (
                  <>
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={70}
                      sx={{ mx: 'auto', mb: 2 }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={30}
                      sx={{ mx: 'auto' }}
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      fontWeight={900}
                      fontSize="5em"
                      color="#fff"
                      fontFamily="Poppins"
                    >
                      {i === 0
                        ? adultRate !== undefined
                          ? `₱${adultRate}`
                          : 'No data'
                        : childRate !== undefined
                          ? `₱${childRate}`
                          : 'No data'}
                    </Typography>
                    <Typography variant="h4" color="#fff" fontFamily="Poppins">
                      {i === 0 ? 'Adult' : 'Child'} Rate Swimming
                    </Typography>
                  </>
                )}
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center">
            {isLoading ? (
              <Skeleton variant="text" width={500} height={40} sx={{ mx: 'auto' }} />
            ) : (
              <Typography
                variant="h4"
                color="#634131"
                fontFamily="Poppins"
                textAlign="center"
                data-aos="zoom-in"
              >
                Senior Citizens / PWD -
                {pwdSeniorRate !== undefined ? `₱${pwdSeniorRate}` : 'No data'}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default RateSection;
