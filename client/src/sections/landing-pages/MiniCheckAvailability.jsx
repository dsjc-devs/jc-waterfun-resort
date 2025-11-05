import React, { useState } from 'react';
import TitleTag from 'components/TitleTag2';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Paper,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';

const MiniCheckAvailability = () => {
  const navigate = useNavigate();
  const [bookingMode, setBookingMode] = useState('tour');
  const [criteria, setCriteria] = useState({
    tourDate: null,
    tourType: 'day',
    checkInDate: null,
    checkOutDate: null,
    guests: 2
  });

  const handleInputChange = (field, value) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    searchParams.set('mode', bookingMode);
    searchParams.set('guests', criteria.guests.toString());

    if (bookingMode === 'tour') {
      searchParams.set('tourType', criteria.tourType);
      if (criteria.tourDate) {
        searchParams.set('tourDate', criteria.tourDate.toISOString());
      }
    } else {
      if (criteria.checkInDate) {
        searchParams.set('checkInDate', criteria.checkInDate.toISOString());
      }
      if (criteria.checkOutDate) {
        searchParams.set('checkOutDate', criteria.checkOutDate.toISOString());
      }
    }

    navigate(`/book-now?${searchParams.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          py: { xs: 2, sm: 4, md: 6 },
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 50%, #fff3e0 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, px: { xs: 1, sm: 2, md: 0 } }}>
          <TitleTag
            title="🌊 Quick Availability Check"
            subtitle="Find your perfect getaway in seconds! Choose between day adventures or relaxing overnight stays."
          />

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: { xs: 2, sm: 3, md: 4 },
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxWidth: { xs: '100%', sm: 500, md: 800 },
              mx: 'auto'
            }}
          >
            <Box mb={{ xs: 2, sm: 3 }} textAlign="center">
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={2} alignItems="center">
                <Chip
                  label="🌅 Day/Night Tours"
                  onClick={() => setBookingMode('tour')}
                  color={bookingMode === 'tour' ? 'primary' : 'default'}
                  variant={bookingMode === 'tour' ? 'filled' : 'outlined'}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: { xs: '0.95rem', sm: '0.9rem' },
                    fontWeight: 600,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: { xs: '100%', sm: 'auto' },
                    mb: { xs: 1, sm: 0 },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                    }
                  }}
                />
                <Chip
                  label="🏖️ Overnight Stays"
                  onClick={() => setBookingMode('checkin')}
                  color={bookingMode === 'checkin' ? 'primary' : 'default'}
                  variant={bookingMode === 'checkin' ? 'filled' : 'outlined'}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: { xs: '0.95rem', sm: '0.9rem' },
                    fontWeight: 600,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: { xs: '100%', sm: 'auto' },
                    mb: { xs: 1, sm: 0 },
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                    }
                  }}
                />
              </Stack>
              <Typography variant="body1" color="text.secondary">
                {bookingMode === 'tour'
                  ? ' Perfect for day adventures (7AM-5PM) or magical night experiences (7PM-5AM)'
                  : ' Overnight stays are limited to 1 night only'
                }
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
              <Grid item xs={12} sm={bookingMode === 'tour' ? 4 : 3}>
                {bookingMode === 'tour' ? (
                  <DatePicker
                    label="📅 Tour Date"
                    value={criteria.tourDate}
                    onChange={(date) => handleInputChange('tourDate', date)}
                    minDate={new Date()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)'
                          },
                          fontSize: { xs: '0.95rem', sm: '1rem' }
                        }}
                      />
                    )}
                  />
                ) : (
                  <DatePicker
                    label="🏖️ Check-in"
                    value={criteria.checkInDate}
                    onChange={(date) => handleInputChange('checkInDate', date)}
                    minDate={new Date()}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)'
                          },
                          fontSize: { xs: '0.95rem', sm: '1rem' }
                        }}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={bookingMode === 'tour' ? 3 : 3}>
                {bookingMode === 'tour' ? (
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>Experience</InputLabel>
                    <Select
                      value={criteria.tourType}
                      label="Experience"
                      onChange={(e) => handleInputChange('tourType', e.target.value)}
                      sx={{
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.95rem', sm: '1rem' }
                      }}
                    >
                      <MenuItem value="day">Day Adventure</MenuItem>
                      <MenuItem value="night">Night Experience</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <DatePicker
                    label="🌅 Check-out"
                    value={criteria.checkOutDate}
                    onChange={(date) => handleInputChange('checkOutDate', date)}
                    minDate={criteria.checkInDate ? addDays(criteria.checkInDate, 1) : addDays(new Date(), 1)}
                    maxDate={criteria.checkInDate ? addDays(criteria.checkInDate, 1) : addDays(new Date(), 1)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)'
                          },
                          fontSize: { xs: '0.95rem', sm: '1rem' }
                        }}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Guests"
                  type="number"
                  value={criteria.guests}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 100)) {
                      handleInputChange('guests', value === '' ? '' : parseInt(value));
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      handleInputChange('guests', 1);
                    }
                  }}
                  inputProps={{ min: 1, max: 100 }}
                  fullWidth
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.9)'
                    },
                    fontSize: { xs: '0.95rem', sm: '1rem' }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={bookingMode === 'tour' ? 2 : 3}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<SearchOutlined />}
                  fullWidth
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    fontSize: { xs: '1rem', sm: '0.9rem' },
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={{ xs: 2, sm: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                Need more options? <Button variant="text" onClick={() => navigate('/book-now')} sx={{ textTransform: 'none', fontWeight: 600 }}>View Advanced Search</Button>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default MiniCheckAvailability;