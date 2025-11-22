import React, { useEffect, useState } from 'react';
import { BookOutlined, CheckOutlined, ClockCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, LeftOutlined, MenuOutlined, MoonOutlined, RightOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { PESO_SIGN } from 'constants/constants';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addHours } from 'date-fns';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { useGetBlockedDates } from 'api/blocked-dates';
import { useGetReservations } from 'api/reservations';

import agent from 'api';
import AnimateButton from 'components/@extended/AnimateButton';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';
import ConfirmationDialog from 'components/ConfirmationDialog';
import Loader from 'components/Loader';
import IconButton from 'components/@extended/IconButton';
import LabeledValue from 'components/LabeledValue';
import formatPeso from 'utils/formatPrice';
import MainCard from 'components/MainCard';
import useAuth from 'hooks/useAuth';
import LoginModal from 'components/LoginModal';
import useGetPosition from 'hooks/useGetPosition';
import Calendar from 'sections/portal/modules/reservations/Calendar';

const AccommodationPage = ({ data, isLoading, isOnPortal = true }) => {
  const { isCustomer } = useGetPosition()
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth()

  const { data: blockedDatesRaw = [] } = useGetBlockedDates()
  const { data: reservationData } = useGetReservations(isOnPortal ? { accommodationId: data?._id } : {})
  const { reservations = [] } = reservationData || {}


  // Blocked dates: resort-wide or for this accommodation, and not from reservation
  const blockedDates = (Array.isArray(blockedDatesRaw) ? blockedDatesRaw : (blockedDatesRaw?.blockedDates || []))
    .filter(bd => !bd.isFromReservation && (!bd.accommodationId || bd.accommodationId === data?._id))
    .map(bd => ({
      startDate: new Date(bd.startDate),
      endDate: new Date(bd.endDate),
      reason: bd.reason,
      accommodationId: bd.accommodationId
    }));

  // Booked ranges (from reservations)
  const bookedRanges = (Array.isArray(blockedDatesRaw) ? blockedDatesRaw : (blockedDatesRaw?.blockedDates || []))
    .filter((f) => f.accommodationId === data?._id && f.isFromReservation)
    .map((d) => ({
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
      accommodationId: d.accommodationId
    })) || [];

  const {
    name,
    _id,
    thumbnail,
    pictures,
    type,
    description,
    capacity,
    price,
    maxStayDuration,
    extraPersonFee,
    status,
    notes
  } = data || {};

  const transformedPictures = pictures?.map((pic) => pic?.image) || [];
  const _pictures = [thumbnail, ...transformedPictures];

  // Overnight accommodations use custom time selection similar to previous guest house logic
  const isOvernight = data?.tourType === 'OVERNIGHT_STAY';

  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false)
  const [mode, setMode] = useState('day');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  const applyModeStartTime = (dateLike, mode) => {
    if (!dateLike) return null;
    const d = new Date(dateLike);
    if (mode === "day") {
      d.setHours(7, 0, 0, 0);
    } else {
      d.setHours(19, 0, 0, 0);
    }
    return d;
  };

  const computeModeEnd = (startDate, mode) => {
    if (!startDate) return null;
    const e = new Date(startDate);
    if (mode === "day") {
      e.setHours(17, 0, 0, 0);
    } else {
      e.setDate(e.getDate() + 1);
      e.setHours(7, 0, 0, 0);
    }
    return e;
  };

  const isNightStay = (date) => {
    if (!date) return false;
    const endHour = date.getHours();
    return endHour > 19 || endHour <= 5;
  };

  // Returns true if date is blocked by a blocked date (resort-wide or for this accommodation)
  const isDateBlockedByAdmin = (date, mode) => {
    return blockedDates.some((range) => {
      if (mode === "day") {
        const dayStart = new Date(date);
        dayStart.setHours(7, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(17, 0, 0, 0);
        return range.startDate < dayEnd && range.endDate > dayStart;
      }
      if (mode === "night") {
        const nightStart = new Date(date);
        nightStart.setHours(19, 0, 0, 0);
        const nightEnd = new Date(date);
        nightEnd.setDate(nightEnd.getDate() + 1);
        nightEnd.setHours(7, 0, 0, 0);
        return range.startDate < nightEnd && range.endDate > nightStart;
      }
      return false;
    });
  };

  // Returns true if date is blocked by a reservation
  const isDateBlockedByReservation = (date, mode) => {
    return bookedRanges.some((range) => {
      if (mode === "day") {
        const dayStart = new Date(date);
        dayStart.setHours(7, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(17, 0, 0, 0);
        return range.startDate < dayEnd && range.endDate > dayStart;
      }
      if (mode === "night") {
        const nightStart = new Date(date);
        nightStart.setHours(19, 0, 0, 0);
        const nightEnd = new Date(date);
        nightEnd.setDate(nightEnd.getDate() + 1);
        nightEnd.setHours(7, 0, 0, 0);
        return range.startDate < nightEnd && range.endDate > nightStart;
      }
      return false;
    });
  };

  // Unified check for UI
  const isDateBlocked = (date, mode) => {
    return isDateBlockedByAdmin(date, mode) || isDateBlockedByReservation(date, mode);
  };

  const isDateBlockedGuestHouse = (startDate, endDate) => {
    if (!startDate || !endDate) return false;

    return bookedRanges.some(range =>
      (startDate < range.endDate && endDate > range.startDate)
    );
  };

  const isTimeBlocked = (date) => {
    return bookedRanges.some(
      (range) => date >= range.startDate && date < range.endDate
    );
  };

  useEffect(() => {
    if (!startDate) return;

    const computedEnd = addHours(startDate, maxStayDuration);
    setEndDate(computedEnd);

    if (!manualMode && isOvernight) {
      setMode(isNightStay(computedEnd) ? "night" : "day");
    }
  }, [startDate, maxStayDuration, type, manualMode]);

  const bookingData = JSON.parse(sessionStorage.getItem("bookingData"))

  useEffect(() => {
    if (bookingData?.startDate) {
      setStartDate(new Date(bookingData?.startDate))
    }
  }, [bookingData])

  useEffect(() => {
    setManualMode(false);
  }, [startDate]);

  // Initialize date/mode from URL params (coming from Check Availability)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode'); // 'tour' | 'checkin'
    const tourType = params.get('tourType'); // 'day' | 'night'
    const tourDate = params.get('tourDate');
    const checkInDate = params.get('checkInDate');
    const checkOutDate = params.get('checkOutDate');
    const startParam = params.get('startDate');
    const endParam = params.get('endDate');

    try {
      // Tour mode date
      if ((modeParam === 'tour') || (tourType && tourDate)) {
        const m = tourType === 'night' ? 'night' : 'day';
        setMode(m);
        if (tourDate) {
          const raw = new Date(tourDate);
          if (!isNaN(raw.getTime())) {
            const s = applyModeStartTime(raw, m);
            const e = computeModeEnd(s, m);
            setStartDate(s);
            setEndDate(e);
            setManualMode(true);
          }
        }
        return;
      }

      // Check-in/out dates
      if ((modeParam === 'checkin') || (checkInDate && checkOutDate)) {
        const s = checkInDate ? new Date(checkInDate) : (startParam ? new Date(startParam) : null);
        const e = checkOutDate ? new Date(checkOutDate) : (endParam ? new Date(endParam) : null);
        if (s && !isNaN(s.getTime())) setStartDate(s);
        if (e && !isNaN(e.getTime())) setEndDate(e);
        if (e) setMode(isNightStay(e) ? 'night' : 'day');
        setManualMode(true);
        return;
      }

      // Fallback explicit start/end
      if (startParam || endParam) {
        const s = startParam ? new Date(startParam) : null;
        const e = endParam ? new Date(endParam) : null;
        if (s && !isNaN(s.getTime())) setStartDate(s);
        if (e && !isNaN(e.getTime())) setEndDate(e);
        if (e) setMode(isNightStay(e) ? 'night' : 'day');
        setManualMode(true);
      }
    } catch (_) {
      // ignore malformed params
    }
  }, [location.search]);

  const handleModeChange = (event, newMode) => {
    if (!newMode) return;
    setMode(newMode);
    setManualMode(true);

    if (startDate) {
      const newStart = applyModeStartTime(startDate, newMode);
      const newEnd = computeModeEnd(newStart, newMode);

      if (isDateBlockedGuestHouse(newStart, newEnd) || isTimeBlocked(newStart) || isDateBlocked(newStart, newMode)) {
        toast.error("This date/time isn't available for the selected mode.");
        return;
      }

      setStartDate(newStart);
      setEndDate(newEnd);
    }
  };

  const handleEdit = (id) => {
    navigate(`/portal/accommodations/form?id=${id}&isEditMode=true&type=${type}`);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await agent.Accommodations.deleteAccommodation(id);
      toast.success('Deleted successfully.', { position: 'top-right', autoClose: 3000 });
      navigate(`/portal/accommodations?type=${type}`);
    } catch (error) {
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
      setIsDeleteOpen(false);
    }
  };

  const openViewer = (img) => {
    const index = _pictures.findIndex(picture => picture === img);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setViewerOpen(true);
  };

  const openGallery = () => {
    setGalleryOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? _pictures.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === _pictures.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <React.Fragment>
      {(loading || isLoading) && (
        <React.Fragment>
          <Loader />
          <EmptyUserCard title='Loading...' />
        </React.Fragment>
      )}

      {isOnPortal && (
        <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={2}>

          {isCustomer && (
            <AnimateButton>
              <Button
                variant='contained'
                color='primary'
                startIcon={<BookOutlined />}
                onClick={() => navigate(`/accommodations/details/${_id}#book_reservation_section`)}
              >
                Book a Reservation
              </Button>
            </AnimateButton>
          )}

          {!isCustomer && (
            <React.Fragment>
              <AnimateButton>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<EyeOutlined />}
                  onClick={() => window.open(`/accommodations/details/${_id}`)}
                >
                  Public view
                </Button>
              </AnimateButton>
              <AnimateButton>
                <Button
                  variant='contained'
                  color='info'
                  startIcon={<EditOutlined />}
                  onClick={() => handleEdit(_id)}
                >
                  Edit
                </Button>
              </AnimateButton>

              <AnimateButton>
                <Button
                  variant='contained'
                  color='error'
                  startIcon={<DeleteOutlined />}
                  onClick={() => setIsDeleteOpen(true)}
                >
                  Delete
                </Button>
              </AnimateButton>
            </React.Fragment>
          )}
        </Stack>
      )}

      <Box marginBlock={2}>
        <Box sx={{ position: 'relative', my: 2 }}>
          <ImageList
            sx={{ width: '100%', height: "100%" }}
            variant="quilted"
            cols={3}
            rowHeight={200}
            style={{ borderRadius: "14px" }}
          >
            {_pictures?.slice(0, 3)?.map((item, index) => (
              <ImageListItem
                key={item}
                cols={index === 0 ? 2 : 1}
                rows={index === 0 ? 2 : 1}
              >
                <img
                  alt={item}
                  src={item}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                  onClick={() => openViewer(item)}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <Stack
            sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1 }}
          >
            <Button
              sx={{
                background: '#fff',
                color: '#333',
                '&:hover': { background: '#333', color: '#fff' }
              }}
              variant='contained'
              startIcon={<MenuOutlined />}
              onClick={openGallery}
            >
              Show all photos
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={2} marginBlock={2} direction={{ xs: 'column-reverse', md: 'row' }}>
          <Grid item xs={12} md={isOnPortal ? 12 : 8} marginBlockEnd={2}>
            <Box marginBlockEnd={2}>
              <Typography variant='h2' gutterBottom>{name}</Typography>
              <Typography variant='body1' color='secondary'>{description}</Typography>
            </Box>

            <Grid container spacing={3} marginBlock={2}>
              {isOnPortal && (
                <Grid item xs={12} sm={6} md={4}>
                  <LabeledValue
                    title="Status"
                    subTitle={
                      <Chip
                        label={status}
                        color={{
                          POSTED: "success",
                          ARCHIVED: "error",
                        }[status]}
                        size="small"
                      />
                    }
                    icon={<CheckOutlined style={{ fontSize: 20 }} />}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Capacity"
                  subTitle={`${capacity} Guests`}
                  icon={<UserOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Day Price"
                  subTitle={formatPeso(price?.day)}
                  icon={<Typography fontSize={24}>{PESO_SIGN}</Typography>}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Night Price"
                  subTitle={formatPeso(price?.night)}
                  icon={<Typography fontSize={24}>{PESO_SIGN}</Typography>}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Extra Person Fee"
                  subTitle={formatPeso(extraPersonFee)}
                  icon={<Typography fontSize={24}>{PESO_SIGN}</Typography>}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LabeledValue
                  title="Stay Duration"
                  subTitle={`${maxStayDuration} Hours`}
                  icon={<ClockCircleOutlined style={{ fontSize: 20 }} />}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {notes && (
              <Box marginBlock={5}>
                <Box dangerouslySetInnerHTML={{ __html: notes }} />
              </Box>
            )}

            {(!isOnPortal && isCustomer) && (
              <Box marginBlock={15} id="book_reservation_section">
                <Typography
                  variant='h2'
                  sx={{ borderLeft: theme => `5px solid ${theme.palette.primary.light}`, pl: 2, mb: 2 }}
                >
                  Book a Reservation
                </Typography>

                <Box sx={{ background: '#f5f5f5', borderRadius: "12px", p: 2 }}>
                  {!isOvernight && (
                    <Box marginBlockEnd={2}>
                      <Typography variant='body1' color='secondary' gutterBottom> Time of Day </Typography>

                      <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleModeChange}
                        aria-label="time of day selection"
                        color="primary"
                      >
                        <ToggleButton
                          value="day"
                          aria-label="day mode"
                          disabled={startDate && isDateBlocked(startDate, "day")}
                        >
                          <SunOutlined style={{ marginRight: 6 }} /> Day Tour (7 AM - 5 PM)
                        </ToggleButton>

                        <ToggleButton
                          value="night"
                          aria-label="night mode"
                          disabled={startDate && isDateBlocked(startDate, "night")}
                        >
                          <MoonOutlined style={{ marginRight: 6 }} /> Night Tour (7 PM - 5 AM)
                        </ToggleButton>
                      </ToggleButtonGroup>

                      {startDate && (
                        <Typography
                          variant="body2"
                          color="warning.main"
                          sx={{ mt: 1, fontStyle: "italic" }}
                        >
                          {isDateBlockedByAdmin(startDate, "day") && !isDateBlockedByAdmin(startDate, "night") &&
                            "Only Night Tour is available for this date (blocked by admin)."}
                          {!isDateBlockedByAdmin(startDate, "day") && isDateBlockedByAdmin(startDate, "night") &&
                            "Only Day Tour is available for this date (blocked by admin)."}
                          {isDateBlockedByAdmin(startDate, "day") && isDateBlockedByAdmin(startDate, "night") &&
                            "No tours are available for this date (blocked by admin)."}
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Box marginBlock={2}>
                    <Typography variant="h4" gutterBottom>
                      Select Date
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      {isOvernight ? (
                        <DateTimePicker
                          value={startDate}
                          onChange={(newValue) => {
                            if (!newValue) return;

                            const computedEnd = addHours(newValue, maxStayDuration);
                            const blocked = isDateBlockedGuestHouse(newValue, computedEnd) || isTimeBlocked(newValue);

                            if (blocked) {
                              toast.error("This date/time is not available.", { position: "top-right" });
                              return;
                            }

                            setStartDate(newValue);
                            setEndDate(computedEnd);

                            setMode(isNightStay(computedEnd) ? "night" : "day");
                          }}
                          disablePast
                          ampm
                          views={["year", "month", "day", "hours"]}
                          shouldDisableTime={(timeValue, clockType) => {
                            if (!startDate) return false;
                            const testDate = new Date(startDate);
                            if (clockType === "hours") testDate.setHours(timeValue);
                            return isTimeBlocked(testDate);
                          }}
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      ) : (
                        <DatePicker
                          value={startDate}
                          onChange={(newValue) => {
                            if (!newValue) return;

                            const startDate = applyModeStartTime(newValue, mode);
                            const computedEnd = computeModeEnd(startDate, mode);

                            if (isDateBlockedGuestHouse(startDate, computedEnd) || isTimeBlocked(startDate) || isDateBlocked(startDate, mode)) {
                              toast.error("This date/time is not available.");
                              return;
                            }

                            setStartDate(startDate);
                            setEndDate(computedEnd);
                          }}
                          disablePast
                          shouldDisableDate={(date) => isDateBlocked(date, mode)}
                          slotProps={{ textField: { fullWidth: true } }}
                        />

                      )}
                    </LocalizationProvider>
                  </Box>

                  <Box marginBlock={2}>
                    <Stack direction='row' justifyContent='flex-endDate' alignItems='center'>
                      <AnimateButton>
                        <Button
                          variant='contained'
                          sx={{ borderRadius: 2 }}
                          disabled={
                            !startDate ||
                            isDateBlockedGuestHouse(startDate) ||
                            isTimeBlocked(startDate)
                          }
                          onClick={() =>
                            navigate(
                              `/book-a-reservation?accommodationId=${_id}` +
                              `&startDate=${startDate.toISOString()}` +
                              `&endDate=${endDate.toISOString()}` +
                              `&mode=${mode}`
                            )
                          }
                        >
                          Book Now
                        </Button>
                      </AnimateButton>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            )}
          </Grid>

          {(!isOnPortal) && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  position: 'sticky',
                  top: 80,
                }}
              >
                <MainCard>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ borderRadius: 2 }}
                    onClick={() => {
                      if (!isCustomer && isLoggedIn) {
                        toast.error("Only customers can book a reservation.");
                      }

                      if (isLoggedIn) {
                        const element = document.getElementById("book_reservation_section");
                        if (element) {
                          const yOffset = -200;
                          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                          window.scrollTo({ top: y, behavior: "smooth" });
                        }
                      } else {
                        setOpenLogin(true);
                      }
                    }}
                  >
                    Book a Reservation
                  </Button>
                </MainCard>
              </Box>
            </Grid>
          )}
        </Grid>

        {(isOnPortal && !isCustomer) && (
          <Calendar events={reservations} title={`${name}`} subtitle='See all scheduled reservations, events, and maintenance for this accommodation at a glance.'
          />
        )}
      </Box>

      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', minHeight: '80vh' }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setViewerOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseOutlined />
          </IconButton>

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              {currentImageIndex + 1} / {_pictures.length}
            </Typography>
          </Box>

          {/* Main Image */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh',
              position: 'relative',
            }}
          >
            {/* Previous Button */}
            <IconButton
              onClick={goToPrevious}
              disabled={_pictures.length <= 1}
              sx={{
                position: 'absolute',
                left: 16,
                zIndex: 5,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  opacity: 0.3,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <LeftOutlined style={{ fontSize: '24px' }} />
            </IconButton>

            {/* Current Image */}
            <Box
              component="img"
              src={_pictures[currentImageIndex]}
              alt={`Accommodation ${currentImageIndex + 1}`}
              sx={{
                maxWidth: '90%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.5s ease',
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'scale(0.95)' },
                  '100%': { opacity: 1, transform: 'scale(1)' }
                }
              }}
            />

            {/* Next Button */}
            <IconButton
              onClick={goToNext}
              disabled={_pictures.length <= 1}
              sx={{
                position: 'absolute',
                right: 16,
                zIndex: 5,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.1)',
                },
                '&:disabled': {
                  opacity: 0.3,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <RightOutlined style={{ fontSize: '24px' }} />
            </IconButton>
          </Box>

          {/* Thumbnail Strip */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              p: 3,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 3,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.5)',
                },
              },
            }}
          >
            {_pictures.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 80,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: currentImageIndex === index
                    ? '3px solid rgba(255, 255, 255, 0.8)'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  opacity: currentImageIndex === index ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    transform: 'scale(1.05)',
                    border: '3px solid rgba(255, 255, 255, 0.6)',
                  },
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <Stack direction='row' justifyContent='flex-endDate'>
          <IconButton onClick={() => setGalleryOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <DialogContent dividers>
          <ImageList variant="masonry" cols={3} gap={8}>
            {_pictures?.map((img, index) => (
              <ImageListItem key={index}>
                <img
                  src={img}
                  alt={`accommodation-${index}`}
                  loading="lazy"
                  style={{ width: '100%', borderRadius: 8, cursor: 'pointer' }}
                  onClick={() => openViewer(img)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        title={`Delete ${name}`}
        description={`Are you sure you want to delete ${name}?`}
        handleConfirm={() => handleDelete(_id)}
        open={isDeleteOpen}
        handleClose={() => setIsDeleteOpen(false)}
      />

      <LoginModal
        open={openLogin}
        handleClose={() => setOpenLogin(false)}
        message="You need to be logged in to continue."
      />
    </React.Fragment >
  );
};

export default AccommodationPage;

