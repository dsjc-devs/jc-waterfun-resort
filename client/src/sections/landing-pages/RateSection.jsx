import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Container,
  Card,
  Button,
} from '@mui/material';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useGetResortRates } from 'api/resort-rates';
import { useSearchParams, useNavigate } from 'react-router-dom';

import TitleTag2 from 'components/TitleTag2';

const RateSection = ({ isDisplayLearnMore = true }) => {
  const { resortRates, isLoading } = useGetResortRates();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('day');
  const [selectedDate,] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'day' || typeParam === 'night') {
      setMode(typeParam);
    }
  }, [searchParams]);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) setMode(newMode);
  };

  const adultRate = resortRates?.entranceFee?.adult?.[mode];
  const childRate = resortRates?.entranceFee?.child?.[mode];
  const pwdSeniorRate = resortRates?.entranceFee?.pwdSenior?.[mode];

  return (
    <React.Fragment>
      <Box sx={{ backgroundColor: '#f4e8cf', paddingBlock: 8 }}>
        <Container>
          {isLoading ? (
            <Box textAlign="center" mb={3}>
              <Skeleton variant="text" width={300} height={50} sx={{ mx: 'auto' }} />
              <Skeleton variant="text" width={500} height={30} sx={{ mx: 'auto' }} />
            </Box>
          ) : (
            <TitleTag2
              title="Entrance Fees"
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
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
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
                    px: 4,
                    py: 2,
                    mx: 0.5,
                    backgroundColor: mode === 'day' ? '#e8f5fd' : '#fff',
                    color: '#004b80',
                    fontWeight: 700,
                    fontFamily: 'Poppins',
                    fontSize: '1.1rem',
                    border: 'none',
                    boxShadow: mode === 'day' ? '0 4px 12px rgba(42,147,193,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e8f5fd',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <SunOutlined style={{ marginRight: 8, color: '#f9d976', fontSize: 24 }} />
                  Day Tour
                </ToggleButton>
                <ToggleButton
                  value="night"
                  aria-label="night mode"
                  disabled={selectedDate && isDateBlocked(selectedDate, 'night')}
                  sx={{
                    borderRadius: 8,
                    px: 4,
                    py: 2,
                    mx: 0.5,
                    backgroundColor: mode === 'night' ? '#e8f5fd' : '#fff',
                    color: '#004b80',
                    fontWeight: 700,
                    fontFamily: 'Poppins',
                    fontSize: '1.1rem',
                    border: 'none',
                    boxShadow: mode === 'night' ? '0 4px 12px rgba(42,147,193,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#e8f5fd',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <MoonOutlined style={{ marginRight: 8, color: '#2a93c1', fontSize: 24 }} />
                  Night Tour
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>

          <Grid container spacing={3} marginBlock={5}>
            <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="100">
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #2a93c1 0%, #1e7a9a 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 12px 40px rgba(42,147,193,0.3)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Typography variant="h6" fontFamily="Poppins" mb={2} opacity={0.9}>
                  ADULT RATE
                </Typography>
                {isLoading ? (
                  <Skeleton variant="text" width="80%" height={80} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography
                    fontWeight={900}
                    fontSize="4rem"
                    fontFamily="Poppins"
                    mb={1}
                  >
                    ₱{adultRate || '---'}
                  </Typography>
                )}
                <Typography variant="h6" fontFamily="Poppins" opacity={0.8}>
                  Per Person
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="200">
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f29023 0%, #d17a1a 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 12px 40px rgba(242,144,35,0.3)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Typography variant="h6" fontFamily="Poppins" mb={2} opacity={0.9}>
                  CHILD RATE
                </Typography>
                {isLoading ? (
                  <Skeleton variant="text" width="80%" height={80} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography
                    fontWeight={900}
                    fontSize="4rem"
                    fontFamily="Poppins"
                    mb={1}
                  >
                    ₱{childRate || '---'}
                  </Typography>
                )}
                <Typography variant="h6" fontFamily="Poppins" opacity={0.8}>
                  Per Child (3-12 years)
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="300">
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #634131 0%, #4a2e1f 100%)',
                  color: 'white',
                  textAlign: 'center',
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 12px 40px rgba(99,65,49,0.3)',
                  transform: 'translateY(0)',
                  transition: 'transform 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Typography variant="h6" fontFamily="Poppins" mb={2} opacity={0.9}>
                  PWD / SENIOR
                </Typography>
                {isLoading ? (
                  <Skeleton variant="text" width="80%" height={80} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography
                    fontWeight={900}
                    fontSize="4rem"
                    fontFamily="Poppins"
                    mb={1}
                  >
                    ₱{pwdSeniorRate || '---'}
                  </Typography>
                )}
                <Typography variant="h6" fontFamily="Poppins" opacity={0.8}>
                  With Valid ID
                </Typography>
              </Card>
            </Grid>
          </Grid>
          {isDisplayLearnMore && (
            <Box textAlign="center" mt={6}>
              <Button
                onClick={() => navigate('/resort-rates')}
                sx={{
                  background: 'linear-gradient(90deg, #2a93c1 0%, #f29023 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontFamily: 'Poppins',
                  fontSize: '1.15rem',
                  px: 6,
                  py: 2.5,
                  borderRadius: 4,
                  boxShadow: '0 6px 24px rgba(42,147,193,0.18)',
                  textTransform: 'none',
                  letterSpacing: 1,
                  border: 'none',
                  transition: 'all 0.25s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #f29023 0%, #2a93c1 100%)',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(42,147,193,0.22)',
                    transform: 'translateY(-2px) scale(1.04)',
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </React.Fragment>
  );
};

export default RateSection;
