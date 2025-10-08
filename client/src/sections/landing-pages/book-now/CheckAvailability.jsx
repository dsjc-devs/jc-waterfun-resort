import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  CardMedia,
  Divider,
  Paper,
  Container,
  Avatar,
  IconButton,
  Tooltip,
  Badge,
  alpha
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { SearchOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useCheckAvailability, useGetAccommodations } from 'api/accommodations';
import { useGetBlockedDates } from 'api/blocked-dates';
import MainCard from 'components/MainCard';
import textFormatter from 'utils/textFormatter';
import { PESO_SIGN, NO_CATEGORY } from 'constants/constants';

const CheckAvailability = () => {
  const topRef = useRef(null);
  const location = useLocation();
  const [bookingMode, setBookingMode] = useState('tour');
  const [criteria, setCriteria] = useState({
    tourDate: null,
    tourType: 'day',
    checkInDate: null,
    checkOutDate: null,
    guests: 2,
    minPrice: 0,
    maxPrice: 20000,
    page: 1,
    limit: 12
  });

  const [searchCriteria, setSearchCriteria] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [priceInputs, setPriceInputs] = useState({ min: '0', max: '20000' });

  const { data, isLoading, error, mutate } = useCheckAvailability(searchCriteria);

  const { data: blockedDatesData } = useGetBlockedDates();

  const { data: accommodationsData } = useGetAccommodations({ limit: 1000 });

  const maxPrice = React.useMemo(() => {
    if (!accommodationsData?.accommodations) return 20000;
    const prices = accommodationsData.accommodations.flatMap(acc => [acc.price?.day || 0, acc.price?.night || 0]);
    return Math.max(...prices, 20000);
  }, [accommodationsData]);

  React.useEffect(() => {
    if (maxPrice && priceRange[1] < maxPrice) {
      setPriceRange([0, maxPrice]);
      setPriceInputs({ min: '0', max: maxPrice.toString() });
      setCriteria(prev => ({ ...prev, maxPrice }));
    }
  }, [maxPrice]);

  React.useEffect(() => {
    if (data && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [data]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const mode = searchParams.get('mode');
    const guests = searchParams.get('guests');
    const tourType = searchParams.get('tourType');
    const tourDate = searchParams.get('tourDate');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');

    if (mode || guests || tourType || tourDate || checkInDate || checkOutDate) {
      if (mode) {
        setBookingMode(mode);
      }

      setCriteria(prev => {
        const updated = { ...prev };

        if (guests) {
          updated.guests = parseInt(guests);
        }

        if (mode === 'tour') {
          if (tourType) {
            updated.tourType = tourType;
          }
          if (tourDate) {
            updated.tourDate = new Date(tourDate);
          }
        } else if (mode === 'checkin') {
          if (checkInDate) {
            updated.checkInDate = new Date(checkInDate);
          }
          if (checkOutDate) {
            updated.checkOutDate = new Date(checkOutDate);
          }
        }

        return updated;
      });
    }
  }, [location.search]);

  const handleSearch = useCallback(() => {
    const guestCount = criteria.guests === '' ? 1 : criteria.guests;
    const searchParams = {
      guests: guestCount,
      page: 1,
      limit: criteria.limit
    };

    if (bookingMode === 'tour') {
      searchParams.tourType = criteria.tourType;

      if (criteria.tourDate) {
        const tourDate = new Date(criteria.tourDate);
        const nextDay = new Date(tourDate);
        nextDay.setDate(nextDay.getDate() + 1);
        searchParams.tourDate = tourDate.toISOString().split('T')[0];
        searchParams.startDate = tourDate.toISOString().split('T')[0];
        searchParams.endDate = nextDay.toISOString().split('T')[0];
      }
    } else {

      if (criteria.checkInDate) {
      }
      if (criteria.checkOutDate) {
        searchParams.endDate = criteria.checkOutDate.toISOString().split('T')[0];
      }
    }

    if (priceRange[0] > 0) {
      searchParams.minPrice = priceRange[0];
    }
    if (priceRange[1] < maxPrice) {
      searchParams.maxPrice = priceRange[1];
    }

    setSearchCriteria(searchParams);
    setCriteria(prev => ({ ...prev, page: 1 }));
  }, [bookingMode, criteria.tourDate, criteria.checkInDate, criteria.checkOutDate, criteria.tourType, criteria.guests, criteria.limit, priceRange, maxPrice]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasUrlParams = searchParams.has('mode') || searchParams.has('tourDate') || searchParams.has('checkInDate') || searchParams.has('guests') || searchParams.has('tourType');

    if (hasUrlParams) {
      const timer = setTimeout(() => {
        if (bookingMode === 'tour') {
          handleSearch();
        } else if (bookingMode === 'checkin' && criteria.checkInDate && criteria.checkOutDate) {
          handleSearch();
        } else if (bookingMode === 'checkin' && criteria.checkInDate) {
          handleSearch();
        } else if (bookingMode === 'checkin') {
          handleSearch();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [bookingMode, criteria.tourDate, criteria.checkInDate, criteria.checkOutDate, criteria.tourType, criteria.guests, location.search, handleSearch]);



  const handlePageChange = (event, value) => {
    if (searchCriteria) {
      setSearchCriteria(prev => ({ ...prev, page: value }));
      setCriteria(prev => ({ ...prev, page: value }));

      if (topRef.current) {
        topRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    setPriceInputs({ min: newValue[0].toString(), max: newValue[1].toString() });
  };

  const handleInputChange = (field, value) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const getTourDuration = () => {
    return criteria.tourType === 'day' ? '10 hours (7AM - 5PM)' : '10 hours (7PM - 5AM)';
  };

  const getTourPrice = (price) => {
    return criteria.tourType === 'day' ? price.day : price.night;
  };

  const checkBlockedDatesConflict = () => {
    if (!blockedDatesData) return null;
    let start, end;
    if (bookingMode === 'tour' && criteria.tourDate) {
      const tourDate = new Date(criteria.tourDate);
      start = new Date(tourDate);
      end = new Date(tourDate);
      end.setDate(end.getDate() + 1);
    } else if (bookingMode === 'checkin' && criteria.checkInDate && criteria.checkOutDate) {
      start = new Date(criteria.checkInDate);
      end = new Date(criteria.checkOutDate);
    } else {
      return null;
    }
    const conflictingBlocks = blockedDatesData.filter(block => {
      const blockStart = new Date(block.startDate);
      const blockEnd = new Date(block.endDate);
      return blockStart < end && blockEnd > start;
    });
    return conflictingBlocks;
  };

  const AccommodationCard = ({ accommodation }) => {
    const { _id, thumbnail, name, description, capacity, price, type, hasPoolAccess } = accommodation;

    const calculateNights = () => {
      if (bookingMode === 'checkin' && criteria.checkInDate && criteria.checkOutDate) {
        const diffTime = Math.abs(criteria.checkOutDate - criteria.checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      }
      return 0;
    };

    const nights = calculateNights();
    const tourPrice = bookingMode === 'tour' ? getTourPrice(price) : null;
    const tourDuration = bookingMode === 'tour' ? getTourDuration() : null;

    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          transition: '0.3s',
          '&:hover': { boxShadow: 6 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CardMedia component="img" height="240" image={thumbnail} alt={name} />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Typography gutterBottom variant="h6" component="div" sx={{ flex: 1 }}>
              {name}
            </Typography>
            {textFormatter.fromSlug(type) !== NO_CATEGORY && (
              <Chip label={textFormatter.fromSlug(type)} color="primary" size="small" />
            )}
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2}
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '4.5em',
              flexGrow: 1
            }}
          >
            {description}
          </Typography>

          <Box mb={2}>
            <Stack direction="row" spacing={2} alignItems="center" mb={1}>
              <Box display="flex" alignItems="center">
                <UserOutlined style={{ marginRight: 4, color: '#666' }} />
                <Typography variant="body2" color="text.secondary">
                  Up to {capacity} guests
                </Typography>
              </Box>
              {hasPoolAccess && (
                <Chip label="Pool Access" variant="outlined" size="small" color="info" />
              )}
            </Stack>

            <Divider sx={{ my: 1 }} />

            {bookingMode === 'tour' ? (
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Day Tour (7AM - 5PM)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: criteria.tourType === 'day' ? 'primary.main' : 'text.secondary' }}>
                    {PESO_SIGN}{price.day.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Night Tour (7PM - 5AM)
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: criteria.tourType === 'night' ? 'primary.main' : 'text.secondary' }}>
                    {PESO_SIGN}{price.night.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Day Rate
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {PESO_SIGN}{price.day.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Night Rate
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {PESO_SIGN}{price.night.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            )}

            {/* Tour Mode Summary */}
            {bookingMode === 'tour' && criteria.tourDate && (
              <Box mt={2} p={2} sx={{
                backgroundColor: criteria.tourType === 'day' ? 'warning.50' : 'info.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: criteria.tourType === 'day' ? 'warning.200' : 'info.200'
              }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selected: {criteria.tourType.charAt(0).toUpperCase() + criteria.tourType.slice(1)} Tour
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  {tourDuration}
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  {PESO_SIGN}{tourPrice.toLocaleString()}
                </Typography>
              </Box>
            )}

            {/* Check-in Mode Summary */}
            {bookingMode === 'checkin' && nights > 0 && (
              <Box mt={2} p={2} sx={{ backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total for {nights} night{nights > 1 ? 's' : ''}
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                  {PESO_SIGN}{(price.night * nights).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 'auto' }}
            onClick={() => {
              window.open(`/accommodations/details/${_id}`);
            }}
          >
            Select This Accommodation
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 50%, #fff3e0 100%)',
          py: 4
        }}
      >
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              🏖️ Book Your Perfect Experience
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Discover paradise at JC Water Fun Resort. Choose from refreshing day tours or magical night experiences.
            </Typography>
          </Box>

          {/* Search Criteria Form */}
          <Paper
            elevation={8}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Booking Mode Toggle */}
            <Box mb={4}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Choose Your Experience
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant={bookingMode === 'tour' ? 'contained' : 'outlined'}
                  onClick={() => setBookingMode('tour')}
                  startIcon={<CalendarOutlined />}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    background: bookingMode === 'tour'
                      ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                      : 'transparent',
                    border: bookingMode === 'tour'
                      ? 'none'
                      : '2px solid #1976d2',
                    color: bookingMode === 'tour' ? 'white' : '#1976d2',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    boxShadow: bookingMode === 'tour'
                      ? '0 4px 15px rgba(25, 118, 210, 0.3)'
                      : 'none',
                    '&:hover': {
                      background: bookingMode === 'tour'
                        ? 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                        : 'rgba(25, 118, 210, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: bookingMode === 'tour'
                        ? '0 6px 20px rgba(25, 118, 210, 0.4)'
                        : '0 4px 12px rgba(25, 118, 210, 0.2)'
                    }
                  }}
                >
                  Day/Night Tours
                </Button>
                <Button
                  variant={bookingMode === 'checkin' ? 'contained' : 'outlined'}
                  onClick={() => setBookingMode('checkin')}
                  size="large"
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    background: bookingMode === 'checkin'
                      ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
                      : 'transparent',
                    border: bookingMode === 'checkin'
                      ? 'none'
                      : '2px solid #1976d2',
                    color: bookingMode === 'checkin' ? 'white' : '#1976d2',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    boxShadow: bookingMode === 'checkin'
                      ? '0 4px 15px rgba(25, 118, 210, 0.3)'
                      : 'none',
                    '&:hover': {
                      background: bookingMode === 'checkin'
                        ? 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
                        : 'rgba(25, 118, 210, 0.08)',
                      transform: 'translateY(-2px)',
                      boxShadow: bookingMode === 'checkin'
                        ? '0 6px 20px rgba(25, 118, 210, 0.4)'
                        : '0 4px 12px rgba(25, 118, 210, 0.2)'
                    }
                  }}
                >
                  Overnight Stay
                </Button>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  textAlign: 'center',
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #666 0%, #999 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {bookingMode === 'tour'
                  ? '🌊 Perfect for day adventures (7AM-5PM) or magical night experiences (7PM-5AM)'
                  : '🏖️ Traditional resort stay with check-in and check-out dates'
                }
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Date Selection based on booking mode */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 3,
                    border: '1px solid rgba(25, 118, 210, 0.2)',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    📅 {bookingMode === 'tour' ? 'Select Your Adventure' : 'Choose Your Dates'}
                  </Typography>
                  {bookingMode === 'tour' ? (
                    <Stack spacing={3}>
                      <DatePicker
                        label="Tour Date"
                        value={criteria.tourDate}
                        onChange={(date) => handleInputChange('tourDate', date)}
                        minDate={new Date()}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                background: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                                }
                              }
                            }}
                          />
                        )}
                      />
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'primary.main', fontWeight: 500 }}>
                          🌅 Tour Experience
                        </InputLabel>
                        <Select
                          value={criteria.tourType}
                          label="🌅 Tour Experience"
                          onChange={(e) => handleInputChange('tourType', e.target.value)}
                          sx={{
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                            }
                          }}
                        >
                          <MenuItem value="day">
                            <Box sx={{ py: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#f57c00' }}>
                                ☀️ Day Adventure
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                7:00 AM - 5:00 PM • Perfect for families & water activities
                              </Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem value="night">
                            <Box sx={{ py: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#7b1fa2' }}>
                                🌙 Night Experience
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                7:00 PM - 5:00 AM • Magical evening atmosphere & starlight
                              </Typography>
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  ) : (
                    <Stack spacing={3}>
                      <DatePicker
                        label="🏖️ Check-in Date"
                        value={criteria.checkInDate}
                        onChange={(date) => handleInputChange('checkInDate', date)}
                        minDate={new Date()}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                background: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                                }
                              }
                            }}
                          />
                        )}
                      />
                      <DatePicker
                        label="🌅 Check-out Date"
                        value={criteria.checkOutDate}
                        onChange={(date) => handleInputChange('checkOutDate', date)}
                        minDate={criteria.checkInDate ? addDays(criteria.checkInDate, 1) : addDays(new Date(), 1)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                background: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                                }
                              }
                            }}
                          />
                        )}
                      />
                      {criteria.checkInDate && criteria.checkOutDate && (
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{
                            textAlign: 'center',
                            fontWeight: 500,
                            background: 'rgba(25, 118, 210, 0.1)',
                            borderRadius: 2,
                            p: 1
                          }}
                        >
                          🗓️ Duration: {Math.ceil((criteria.checkOutDate - criteria.checkInDate) / (1000 * 60 * 60 * 24))} night(s)
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Paper>
              </Grid>

              {/* Guests and Price Range */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 3,
                    border: '1px solid rgba(25, 118, 210, 0.2)',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    👥 Guest Details & Budget
                  </Typography>
                  <Stack spacing={3}>
                    <TextField
                      label="👨‍👩‍👧‍👦 Number of Guests"
                      type="number"
                      value={criteria.guests}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleInputChange('guests', '');
                        } else {
                          const numValue = parseInt(value);
                          if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
                            handleInputChange('guests', numValue);
                          }
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '' || parseInt(e.target.value) < 1) {
                          handleInputChange('guests', 1);
                        }
                      }}
                      inputProps={{ min: 1, max: 100 }}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                          }
                        }
                      }}
                      helperText="Maximum 100 guests per accommodation"
                    />

                    <Box>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        💰 Budget Range: {PESO_SIGN}{priceRange[0].toLocaleString()} - {PESO_SIGN}{priceRange[1].toLocaleString()}
                      </Typography>

                      {/* Price Input Fields */}
                      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <TextField
                          label="💸 Min Budget"
                          type="number"
                          value={priceInputs.min}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setPriceInputs(prev => ({ ...prev, min: inputValue }));

                            if (inputValue === '') {
                              return;
                            }

                            const numValue = Math.max(0, parseInt(inputValue) || 0);
                            if (numValue <= priceRange[1]) {
                              setPriceRange([numValue, priceRange[1]]);
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              setPriceInputs(prev => ({ ...prev, min: '0' }));
                              setPriceRange([0, priceRange[1]]);
                            }
                          }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: 'primary.main', fontWeight: 600 }}>{PESO_SIGN}</Typography>,
                          }}
                          inputProps={{ min: 0, max: maxPrice, step: 100 }}
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
                              }
                            }
                          }}
                        />
                        <TextField
                          label="💎 Max Budget"
                          type="number"
                          value={priceInputs.max}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            setPriceInputs(prev => ({ ...prev, max: inputValue }));

                            if (inputValue === '') {
                              return;
                            }

                            const numValue = Math.min(maxPrice, parseInt(inputValue) || maxPrice);
                            if (numValue >= priceRange[0]) {
                              setPriceRange([priceRange[0], numValue]);
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              setPriceInputs(prev => ({ ...prev, max: maxPrice.toString() }));
                              setPriceRange([priceRange[0], maxPrice]);
                            }
                          }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1, color: 'primary.main', fontWeight: 600 }}>{PESO_SIGN}</Typography>,
                          }}
                          inputProps={{ min: 0, max: maxPrice, step: 100 }}
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              background: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.1)'
                              }
                            }
                          }}
                        />
                      </Stack>

                      {/* Price Slider */}
                      <Slider
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={maxPrice}
                        step={500}
                        marks={[
                          { value: 0, label: '₱0' },
                          { value: Math.floor(maxPrice * 0.25), label: `₱${Math.floor(maxPrice * 0.25 / 1000)}K` },
                          { value: Math.floor(maxPrice * 0.5), label: `₱${Math.floor(maxPrice * 0.5 / 1000)}K` },
                          { value: Math.floor(maxPrice * 0.75), label: `₱${Math.floor(maxPrice * 0.75 / 1000)}K` },
                          { value: maxPrice, label: `₱${Math.floor(maxPrice / 1000)}K` }
                        ]}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Search Button */}
              <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<SearchOutlined />}
                  sx={{
                    minWidth: 250,
                    py: 2,
                    px: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0px)',
                    }
                  }}
                >
                  🔍 {bookingMode === 'tour' ? 'Find Your Perfect Adventure' : 'Discover Available Rooms'}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Search Results */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error.message || 'Failed to load accommodations'}
            </Alert>
          )}

          {/* Blocked Dates Warning */}
          {(() => {
            const conflictingBlocks = checkBlockedDatesConflict();
            if (conflictingBlocks && conflictingBlocks.length > 0) {
              const globalBlocks = conflictingBlocks.filter(block => !block.accommodationId && !block.isFromReservation);
              const reservationBlocks = conflictingBlocks.filter(block => block.accommodationId && block.isFromReservation);
              const accommodationBlocks = conflictingBlocks.filter(block => block.accommodationId && !block.isFromReservation);

              return (
                <Alert
                  severity="warning"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAlert-icon': {
                      color: '#ff9800'
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#f57c00' }}>
                    📅 Date Availability Notice
                  </Typography>
                  {globalBlocks.length > 0 && (
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <span>🏨</span>
                      <span>Resort-wide blocked dates during your selected period: {globalBlocks.map(block => block.reason).join(', ')}</span>
                    </Typography>
                  )}
                  {reservationBlocks.length > 0 && (
                    <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <span>📋</span>
                      <span>Some accommodations are already booked during your selected dates</span>
                    </Typography>
                  )}
                  {accommodationBlocks.length > 0 && (
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <span>🔧</span>
                      <span>Some specific accommodations may be blocked for maintenance during your selected dates</span>
                    </Typography>
                  )}
                </Alert>
              );
            }
            return null;
          })()}

          {isLoading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {data && (
            <>
              {/* Results Header */}
              <Paper
                ref={topRef}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.05) 100%)',
                  borderRadius: 3,
                  border: '1px solid rgba(25, 118, 210, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center'
                  }}
                >
                  🏖️ Available Accommodations
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 500
                  }}
                >
                  {data.totalAccommodations} amazing accommodation{data.totalAccommodations !== 1 ? 's' : ''} found
                  {bookingMode === 'tour' && criteria.tourDate && (
                    <> for your {criteria.tourType} adventure on {criteria.tourDate.toLocaleDateString()}</>
                  )}
                  {bookingMode === 'checkin' && criteria.checkInDate && criteria.checkOutDate && (
                    <> for your stay from {criteria.checkInDate.toLocaleDateString()} to {criteria.checkOutDate.toLocaleDateString()}</>
                  )}
                </Typography>
              </Paper>

              {/* Accommodation Cards */}
              {data.accommodations && data.accommodations.length > 0 ? (
                <>
                  <Grid container spacing={3} mb={4}>
                    {data.accommodations.map((accommodation) => (
                      <Grid item xs={12} sm={6} lg={4} key={accommodation._id}>
                        <AccommodationCard accommodation={accommodation} />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Pagination */}
                  {data.totalPages > 1 && (
                    <Box display="flex" justifyContent="center">
                      <Pagination
                        count={data.totalPages}
                        page={criteria.page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              ) : (
                searchCriteria && (
                  <MainCard>
                    <Box textAlign="center" py={4}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No accommodations found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search criteria for better results.
                      </Typography>
                    </Box>
                  </MainCard>
                )
              )}
            </>
          )}

          {/* Initial State */}
          {!searchCriteria && !isLoading && (
            <MainCard>
              <Box textAlign="center" py={6}>
                <CalendarOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                <Typography variant="h5" gutterBottom color="text.secondary">
                  {bookingMode === 'tour' ? 'Find Your Perfect Tour Experience' : 'Find Your Perfect Stay'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {bookingMode === 'tour'
                    ? 'Select your tour date, tour type (day or night), number of guests, and price range to see available accommodations.'
                    : 'Select your check-in and check-out dates, number of guests, and price range to see available accommodations.'
                  }
                </Typography>
              </Box>
            </MainCard>
          )}
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default CheckAvailability;