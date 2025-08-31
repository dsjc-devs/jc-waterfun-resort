import React, { useEffect, useState } from 'react';
import { CheckOutlined, ClockCircleOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';
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
import { PESO_SIGN } from 'constants/constants';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addHours } from 'date-fns';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';

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

const bookedRanges = [
  {
    start: new Date("2025-08-27T07:00:00"), // day 7 AM
    end: new Date("2025-08-27T17:00:00"),   // day 5 PM
  },
  // {
  //   start: new Date("2025-08-27T17:00:00"), // night 5 PM
  //   end: new Date("2025-08-28T07:00:00"),   // night 7 AM next day
  // },
];

const AccommodationPage = ({ data, isLoading, isOnPortal = true }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth()

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

  const isGuestHouse = type === "guest_house"

  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
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
      d.setHours(17, 0, 0, 0);
    }
    return d;
  };

  const computeModeEnd = (start, mode) => {
    if (!start) return null;
    const e = new Date(start);
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
    return endHour > 17 || endHour < 6;
  };

  const isDateBlocked = (date, mode) => {
    return bookedRanges.some((range) => {
      if (mode === "day") {
        const dayStart = new Date(date);
        dayStart.setHours(7, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(17, 0, 0, 0);

        return range.start < dayEnd && range.end > dayStart;
      }

      if (mode === "night") {
        const nightStart = new Date(date);
        nightStart.setHours(17, 0, 0, 0);
        const nightEnd = new Date(date);
        nightEnd.setDate(nightEnd.getDate() + 1);
        nightEnd.setHours(7, 0, 0, 0);

        return range.start < nightEnd && range.end > nightStart;
      }

      return false;
    });
  };

  const isDateBlockedGuestHouse = (start, end) => {
    if (!start || !end) return false;

    return bookedRanges.some(range =>
      (start < range.end && end > range.start)
    );
  };

  const isTimeBlocked = (date) => {
    return bookedRanges.some(
      (range) => date >= range.start && date < range.end
    );
  };

  useEffect(() => {
    if (!startDate) return;

    const computedEnd = addHours(startDate, maxStayDuration);
    setEndDate(computedEnd);

    if (!manualMode && isGuestHouse) {
      setMode(isNightStay(computedEnd) ? "night" : "day");
    }
  }, [startDate, maxStayDuration, type, manualMode]);

  useEffect(() => {
    setManualMode(false);
  }, [startDate]);

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
    setCurrentImage(img);
    setViewerOpen(true);
  };

  const openGallery = () => {
    setGalleryOpen(true);
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

        <Grid container spacing={2} marginBlock={2}>
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

            {(!isOnPortal && isLoggedIn) && (
              <Box marginBlock={15} id="book_reservation_section">
                <Typography
                  variant='h2'
                  sx={{ borderLeft: theme => `5px solid ${theme.palette.primary.light}`, pl: 2, mb: 2 }}
                >
                  Book a Reservation
                </Typography>

                <Box sx={{ background: '#f5f5f5', borderRadius: "12px", p: 2 }}>
                  {!isGuestHouse && (
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
                          <MoonOutlined style={{ marginRight: 6 }} /> Night Tour (5 PM - 7 AM)
                        </ToggleButton>
                      </ToggleButtonGroup>

                      {startDate && (
                        <Typography
                          variant="body2"
                          color="warning.main"
                          sx={{ mt: 1, fontStyle: "italic" }}
                        >
                          {isDateBlocked(startDate, "day") && !isDateBlocked(startDate, "night") &&
                            "Only Night Tour is available for this date."}
                          {!isDateBlocked(startDate, "day") && isDateBlocked(startDate, "night") &&
                            "Only Day Tour is available for this date."}
                          {isDateBlocked(startDate, "day") && isDateBlocked(startDate, "night") &&
                            "No tours are available for this date."}
                        </Typography>
                      )}
                    </Box>
                  )}

                  <Box marginBlock={2}>
                    <Typography variant="h4" gutterBottom>
                      Select Date
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      {isGuestHouse ? (
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

                            const start = applyModeStartTime(newValue, mode);
                            const computedEnd = computeModeEnd(start, mode);

                            if (isDateBlockedGuestHouse(start, computedEnd) || isTimeBlocked(start) || isDateBlocked(start, mode)) {
                              toast.error("This date/time is not available.");
                              return;
                            }

                            setStartDate(start);
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
                    <Stack direction='row' justifyContent='flex-end' alignItems='center'>
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

          {!isOnPortal && (
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
                      if (isLoggedIn) {
                        const element = document.getElementById("book_reservation_section");
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      } else {
                        setOpenLogin(true)
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
      </Box>

      <Dialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Stack direction='row' justifyContent='flex-end'>
          <IconButton onClick={() => setViewerOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Stack>
        <DialogContent
          sx={{ display: 'flex', justifyContent: 'center', p: 2 }}
        >
          <img
            src={currentImage}
            alt="Accommodation"
            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8 }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
        <Stack direction='row' justifyContent='flex-end'>
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

