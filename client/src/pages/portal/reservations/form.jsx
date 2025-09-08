import { APP_DEFAULT_PATH } from 'config/config';
import { useLocation } from 'react-router';

import React, { useMemo, useState, useEffect } from 'react';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import PageTitle from 'components/PageTitle';
import FormWrapper from 'components/FormWrapper';
import {
  Box,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Card,
  CardActionArea,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  IconButton,
  TextField,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import { useGetAccommodationTypes } from 'api/accomodation-type';
import { NO_CATEGORY } from 'constants/constants';
import { useGetAccommodations } from 'api/accommodations';
import { useGetBlockedDates } from 'api/blocked-dates';
import { toast } from 'react-toastify';
import { MoonOutlined, SunOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addHours } from 'date-fns';
import { useGetResortRates } from 'api/resort-rates';
import { useGetSingleReservation } from 'api/reservations';

import AnimateButton from 'components/@extended/AnimateButton';
import LoadingButton from 'components/@extended/LoadingButton';
import MainCard from 'components/MainCard';
import RoomCard from 'components/accommodations/RoomCard';
import PaymentSummaryCard from 'components/accommodations/PaymentSummaryCard';
import UserFinder from 'components/users/UserFinder';
import agent from 'api';
import formatPeso from 'utils/formatPrice';

const ReservationForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const isEditMode = queryParams.get('isEditMode') === 'true';
  const reservationId = queryParams.get('reservationId');

  const breadcrumbLinks = [
    { title: 'Home', to: APP_DEFAULT_PATH },
    { title: 'Reservations', to: '/portal/reservations' },
    { title: isEditMode ? 'Edit Reservation' : 'New Reservation' }
  ];

  const [selectedAccommodation, setSelectedAccommodation] = useState({});
  const [mode, setMode] = useState('day');
  const [manualMode, setManualMode] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [entrances, setEntrances] = useState({
    adult: 0,
    child: 0,
    pwdSenior: 0
  });

  const [showEntranceSection, setShowEntranceSection] = useState(false);

  const totalQuantity = entrances.adult + entrances.child + entrances.pwdSenior;
  const hasNoQuantities = totalQuantity === 0;

  const isGuestHouse = selectedAccommodation?.type === 'guest_house';

  const { resortRates } = useGetResortRates();

  const { accomodationTypes } = useGetAccommodationTypes();

  const [initialValues, setInitialValues] = useState({
    userData: {
      userId: '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: ''
    },
    accommodationId: '',
    accommodationType: '',
    startDate: '',
    endDate: '',
    status: 'CONFIRMED',
    guests: 0,
    entrances: {
      adult: 0,
      child: 0,
      pwdSenior: 0
    },
    amount: {
      accommodationTotal: 0,
      entranceTotal: 0,
      total: 0,
      totalPaid: 0,
      adult: 0,
      child: 0,
      pwdSenior: 0
    }
  });

  const { data: singleReservation } = useGetSingleReservation(reservationId)

  const { data: _blockedDates = [] } = useGetBlockedDates();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const payload = {
          userId: values.userData?.userId,
          userData: values.userData,
          accommodationId: values.accommodationId,
          startDate: values.startDate,
          endDate: values.endDate,
          status: values.status,
          entrances: { ...entrances },
          guests: values.guests ? values.guests : totalQuantity,
          amount: {
            accommodationTotal: price,
            entranceTotal: entranceTotal,
            total: total,
            totalPaid: values.amount.totalPaid,
            adult: entranceAmounts.adult,
            child: entranceAmounts.child,
            pwdSenior: entranceAmounts.pwdSenior
          }
        };
        if (isEditMode && reservationId) {
          await agent.Reservations.editReservation(reservationId, payload);
          toast.success('Reservation updated successfully!');
        } else {
          await agent.Reservations.createReservation(payload);
          toast.success('Reservation created successfully!');
          formik.resetForm();
          setSelectedAccommodation({});
          setStartDate(null);
          setEndDate(null);
          setMode('day');
          setManualMode(false);
          setEntrances({ adult: 0, child: 0, pwdSenior: 0 });
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to save reservation');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const getExtraPersonFee = () => {
    let guests = 0;
    if (selectedAccommodation?.hasPoolAccess) {
      guests = totalQuantity;
    } else {
      guests = Number(formik.values.guests) || 0;
    }
    const capacity = Number(selectedAccommodation?.capacity) || 0;
    const extraFee = Number(selectedAccommodation?.extraPersonFee) || 0;
    if (extraFee > 0 && guests > capacity) {
      return (guests - capacity) * extraFee;
    }
    return 0;
  };

  useEffect(() => {
    formik.setFieldValue('entrances', entrances);
  }, [entrances]);

  const { data = {} } = useGetAccommodations({
    type: formik.values.accommodationType,
    sort: 'name'
  });

  const { accommodations } = data || {};

  const blockedDates = useMemo(() => {
    return _blockedDates.filter((bd) => !bd.isFromReservation || bd.accommodationId === formik.values.accommodationId);
  }, [_blockedDates, formik.values.accommodationId]);

  useEffect(() => {
    if (isEditMode && singleReservation) {
      const r = singleReservation;
      let foundAccommodation = null;
      let foundType = '';
      if (accommodations && r.accommodationData?._id) {
        foundAccommodation = accommodations.find(acc => acc._id === r.accommodationData._id);
        foundType = foundAccommodation?.type || r.accommodationData?.type || '';
      } else if (r.accommodationData?.type) {
        foundType = r.accommodationData.type;
      }
      setInitialValues({
        userData: r.userData || initialValues.userData,
        accommodationId: r.accommodationData?._id || '',
        accommodationType: foundType || '',
        startDate: r.startDate || '',
        endDate: r.endDate || '',
        status: r.status || 'CONFIRMED',
        entrances: r.entrances || initialValues.entrances,
        guests: r.guests || 0,
        amount: r.amount || initialValues.amount
      });
      if (r.accommodationData) {
        setSelectedAccommodation(r.accommodationData);
      } else if (foundAccommodation) {
        setSelectedAccommodation(foundAccommodation);
      } else {
        setSelectedAccommodation({ _id: r.accommodationData?._id || '' });
      }
      setStartDate(r.startDate ? new Date(r.startDate) : null);
      setEndDate(r.endDate ? new Date(r.endDate) : null);
      if (r.startDate && r.endDate) {
        const start = new Date(r.startDate);
        const hour = start.getHours();
        if (hour === 7) {
          setMode('day');
        } else if (hour === 17) {
          setMode('night');
        } else {
          setMode('day');
        }
      } else {
        setMode('day');
      }
      setManualMode(false);
      setEntrances(r.entrances || initialValues.entrances);
    }
  }, [isEditMode, singleReservation, accommodations]);

  const handleIncrease = (type) => {
    if (selectedAccommodation?.hasPoolAccess && selectedAccommodation?.capacity && totalQuantity >= selectedAccommodation.capacity) return;
    setEntrances((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const handleDecrease = (type) => {
    setEntrances((prev) => ({
      ...prev,
      [type]: prev[type] > 0 ? prev[type] - 1 : 0
    }));
  };

  const handleQuantityChange = (type, value) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      const nextTotal = totalQuantity - entrances[type] + parsed;
      if (selectedAccommodation?.hasPoolAccess && selectedAccommodation?.capacity && nextTotal > selectedAccommodation.capacity) return;
      setEntrances((prev) => ({ ...prev, [type]: parsed }));
    }
  };

  const handleClearAll = () => {
    setEntrances({ adult: 0, child: 0, pwdSenior: 0 });
  };

  const getPrice = (type) => {
    if (!resortRates) return 0;
    return mode === 'day' ? resortRates?.entranceFee?.[type]?.day || 0 : resortRates?.entranceFee?.[type]?.night || 0;
  };

  const applyModeStartTime = (dateLike, mode) => {
    if (!dateLike) return null;
    const d = new Date(dateLike);
    if (mode === 'day') {
      d.setHours(7, 0, 0, 0);
    } else {
      d.setHours(17, 0, 0, 0);
    }
    return d;
  };

  const computeModeEnd = (startDate, mode) => {
    if (!startDate) return null;
    const e = new Date(startDate);
    if (mode === 'day') {
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

  const isDateBlockedGuestHouse = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return blockedDates.some((range) => new Date(startDate) < new Date(range.endDate) && new Date(endDate) > new Date(range.startDate));
  };

  const isDateBlocked = (date, mode) => {
    return blockedDates.some((range) => {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);

      if (mode === 'day') {
        const dayStart = new Date(date);
        dayStart.setHours(7, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(17, 0, 0, 0);
        return start < dayEnd && end > dayStart;
      }

      if (mode === 'night') {
        const nightStart = new Date(date);
        nightStart.setHours(17, 0, 0, 0);
        const nightEnd = new Date(date);
        nightEnd.setDate(nightEnd.getDate() + 1);
        nightEnd.setHours(7, 0, 0, 0);
        return start < nightEnd && end > nightStart;
      }

      return false;
    });
  };

  const isTimeBlocked = (date) => {
    return blockedDates.some((range) => new Date(date) >= new Date(range.startDate) && new Date(date) < new Date(range.endDate));
  };

  const updateDates = (newStart, newEnd) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    formik.setFieldValue('startDate', newStart?.toISOString() || '');
    formik.setFieldValue('endDate', newEnd?.toISOString() || '');
  };

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

      updateDates(newStart, newEnd);
    }
  };

  const price = mode === "day" ? selectedAccommodation?.price?.day : selectedAccommodation?.price?.night;

  const entranceAmounts = {
    adult: entrances.adult * getPrice('adult'),
    child: entrances.child * getPrice('child'),
    pwdSenior: entrances.pwdSenior * getPrice('pwdSenior')
  };

  const entranceTotal = entranceAmounts.adult + entranceAmounts.child + entranceAmounts.pwdSenior;

  const minimumPayable = (price) * 0.5;

  const extraPersonFee = getExtraPersonFee();
  const total = price + entranceTotal + extraPersonFee;

  const name = selectedAccommodation?.name || '';

  return (
    <React.Fragment>
      <PageTitle title="Reservation Form" />

      <Breadcrumbs
        custom
        heading={isEditMode ? 'Edit Reservation' : 'Create Reservation'}
        links={breadcrumbLinks}
        subheading={
          isEditMode
            ? 'Update details of an existing reservation at the resort.'
            : 'Fill out the form to create a new reservation at the resort.'
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <FormWrapper
            title={isEditMode ? 'Reservation Details' : 'Reservation Information'}
            caption={
              isEditMode ? 'Modify the details of the reservation and save the changes.' : 'Complete the form below to add a new reservation.'
            }
          >
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1"> Accommodation Type </Typography>
                  <Select fullWidth name="accommodationType" value={formik.values.accommodationType || ''} onChange={formik.handleChange}>
                    {accomodationTypes
                      ?.filter((f) => f.title !== NO_CATEGORY)
                      .map((item) => (
                        <MenuItem key={item._id} value={item.slug}>
                          {item.title}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>

                {formik.values.accommodationType && (
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      Select Accommodation
                    </Typography>
                    <MainCard sx={{ maxHeight: 300, overflowY: 'auto' }}>
                      <Grid container spacing={2}>
                        {accommodations?.map((acc) => {
                          const selected = formik.values.accommodationId === acc._id;
                          return (
                            <Grid item xs={12} sm={6} key={acc._id}>
                              <Card
                                sx={{
                                  border: selected ? '3px solid' : '1px solid rgba(0,0,0,0.12)',
                                  borderColor: selected ? 'primary.main' : 'divider',
                                  borderRadius: 2,
                                  boxShadow: selected ? 4 : 0,
                                  transition: '0.2s'
                                }}
                              >
                                <CardActionArea
                                  onClick={() => {
                                    formik.setFieldValue('accommodationId', acc._id);
                                    setSelectedAccommodation(acc);
                                  }}
                                >
                                  <RoomCard
                                    roomData={acc}
                                    isOnPortal={false}
                                    onView={() => window.open(`/portal/accommodations/details/${acc._id}`, '_blank')}
                                  />
                                </CardActionArea>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </MainCard>
                  </Grid>
                )}

                {formik.values.accommodationId && (
                  <Grid item xs={12}>
                    <Typography variant="body1"> Select Dates </Typography>
                    {!isGuestHouse && (
                      <Box marginBlockEnd={2}>
                        <Typography variant="body1" color="secondary" gutterBottom>
                          Time of Day
                        </Typography>

                        <ToggleButtonGroup
                          value={mode}
                          exclusive
                          onChange={handleModeChange}
                          aria-label="time of day selection"
                          color="primary"
                        >
                          <ToggleButton value="day" aria-label="day mode" disabled={startDate && isDateBlocked(startDate, 'day')}>
                            <SunOutlined style={{ marginRight: 6 }} /> Day Tour (7 AM - 5 PM)
                          </ToggleButton>

                          <ToggleButton value="night" aria-label="night mode" disabled={startDate && isDateBlocked(startDate, 'night')}>
                            <MoonOutlined style={{ marginRight: 6 }} /> Night Tour (5 PM - 7 AM)
                          </ToggleButton>
                        </ToggleButtonGroup>

                        {startDate && (
                          <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                            {isDateBlocked(startDate, 'day') &&
                              !isDateBlocked(startDate, 'night') &&
                              'Only Night Tour is available for this date.'}
                            {!isDateBlocked(startDate, 'day') &&
                              isDateBlocked(startDate, 'night') &&
                              'Only Day Tour is available for this date.'}
                            {isDateBlocked(startDate, 'day') && isDateBlocked(startDate, 'night') && 'No tours are available for this date.'}
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

                              const computedEnd = addHours(newValue, selectedAccommodation.maxStayDuration || 10);
                              const blocked = isDateBlockedGuestHouse(newValue, computedEnd) || isTimeBlocked(newValue);

                              if (blocked) {
                                toast.error('This date/time is not available.', {
                                  position: 'top-right'
                                });
                                return;
                              }

                              updateDates(newValue, computedEnd);
                              setMode(isNightStay(computedEnd) ? 'night' : 'day');
                            }}
                            disablePast
                            ampm
                            views={['year', 'month', 'day', 'hours']}
                            shouldDisableTime={(timeValue, clockType) => {
                              if (!startDate) return false;
                              const testDate = new Date(startDate);
                              if (clockType === 'hours') testDate.setHours(timeValue);
                              return isTimeBlocked(testDate);
                            }}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        ) : (
                          <DatePicker
                            value={startDate}
                            onChange={(newValue) => {
                              if (!newValue) return;

                              const s = applyModeStartTime(newValue, mode);
                              const e = computeModeEnd(s, mode);

                              if (isDateBlockedGuestHouse(s, e) || isTimeBlocked(s) || isDateBlocked(s, mode)) {
                                toast.error('This date/time is not available.');
                                return;
                              }

                              updateDates(s, e);
                            }}
                            disablePast
                            shouldDisableDate={(date) => isDateBlocked(date, mode)}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        )}
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                )}

                {startDate && (
                  <Grid item xs={12}>
                    {!selectedAccommodation?.hasPoolAccess && (
                      <Button
                        variant="outlined"
                        startIcon={<PlusOutlined />}
                        onClick={() => setShowEntranceSection((prev) => !prev)}
                        sx={{ mb: 3 }}
                        fullWidth
                      >
                        {showEntranceSection ? "Hide Entrance Tickets" : "Show Entrance Tickets"}
                      </Button>
                    )}

                    {(selectedAccommodation?.hasPoolAccess || showEntranceSection) && (
                      <MainCard>
                        <Box marginBlockEnd={5}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" color="secondary" gutterBottom>
                              Quantity
                            </Typography>

                            <Button size="small" variant="text" sx={{ textDecoration: 'underline' }} color="secondary" onClick={handleClearAll}>
                              Clear All
                            </Button>
                          </Stack>

                          {hasNoQuantities && (
                            <Typography variant="body2" color="error" gutterBottom>
                              Please select at least one guest and this could be up to {selectedAccommodation?.capacity}
                            </Typography>
                          )}

                          {['adult', 'child', 'pwdSenior'].map((type) => (
                            <Box key={type} sx={{ my: 2 }}>
                              <MainCard>
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="h5" fontWeight={700}>
                                      {type === 'adult' ? 'Adult' : type === 'child' ? 'Children' : 'PWD/Senior'}
                                    </Typography>

                                    {type === 'pwdSenior' && entrances.pwdSenior > 0 && (
                                      <Typography variant="caption" color="error" sx={{ fontStyle: 'italic' }}>
                                        *Valid ID must be presented upon entry
                                      </Typography>
                                    )}
                                  </Grid>

                                  <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Typography variant="h4">{formatPeso(getPrice(type))}</Typography>

                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <IconButton
                                          variant="outlined"
                                          onClick={() => handleDecrease(type)}
                                          disabled={entrances[type] === 0}
                                          color="primary"
                                        >
                                          <MinusOutlined />
                                        </IconButton>

                                        <TextField
                                          value={entrances[type]}
                                          size="small"
                                          onChange={(e) => handleQuantityChange(type, e.target.value)}
                                          inputProps={{
                                            style: { textAlign: 'center', width: 40 }
                                          }}
                                        />

                                        <IconButton variant="outlined" onClick={() => handleIncrease(type)} color="primary">
                                          <PlusOutlined />
                                        </IconButton>
                                      </Stack>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </MainCard>
                            </Box>
                          ))}

                          {selectedAccommodation?.hasPoolAccess && selectedAccommodation?.capacity === totalQuantity && (
                            <Alert severity="info">
                              Maximum capacity reached ({totalQuantity}/{selectedAccommodation.capacity})
                            </Alert>
                          )}
                        </Box>
                      </MainCard>
                    )}

                    {!selectedAccommodation?.hasPoolAccess && (
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          Total Guests
                        </Typography>

                        <TextField
                          type="number"
                          placeholder='Enter number of guests'
                          value={formik.values.guests === 0 ? '' : formik.values.guests}
                          onChange={e => {
                            const val = e.target.value;
                            formik.setFieldValue('guests', val === '' ? 0 : Number(val));
                          }}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        Total Paid
                      </Typography>

                      <TextField
                        type="number"
                        value={formik.values.amount.totalPaid === 0 ? '' : formik.values.amount.totalPaid}
                        placeholder='Enter amount paid'
                        onChange={e => {
                          const val = e.target.value;
                          formik.setFieldValue('amount.totalPaid', val === '' ? 0 : Number(val));
                        }}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom> Customer </Typography>
                      <UserFinder
                        isCustomerFinder
                        value={formik.values.userData && formik.values.userData?.userId ? formik.values.userData : null}
                        onChange={user => formik.setFieldValue('userData', user)}
                      />

                      <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Or add customer manually
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>First Name *</Typography>
                            <TextField
                              value={formik.values.userData?.firstName}
                              onChange={e => formik.setFieldValue('userData.firstName', e.target.value)}
                              required
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Last Name</Typography>
                            <TextField
                              value={formik.values.userData?.lastName}
                              onChange={e => formik.setFieldValue('userData.lastName', e.target.value)}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Email Address</Typography>
                            <TextField
                              value={formik.values.userData?.emailAddress}
                              onChange={e => formik.setFieldValue('userData.emailAddress', e.target.value)}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>Phone Number</Typography>
                            <TextField
                              value={formik.values.userData?.phoneNumber}
                              onChange={e => formik.setFieldValue('userData.phoneNumber', e.target.value)}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Box>
          </FormWrapper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ position: "sticky", top: 100 }}>
            <PaymentSummaryCard
              data={{
                accomName: name,
                accomPrice: price,
                includeEntrance: selectedAccommodation?.hasPoolAccess || showEntranceSection,
                entrances,
                entranceTotal,
                minimumPayable,
                total,
                extraPersonFee,
                guests: formik.values.guests,
                capacity: selectedAccommodation?.capacity,
                prices: {
                  adult: entranceAmounts.adult,
                  child: entranceAmounts.child,
                  pwdSenior: entranceAmounts.pwdSenior
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{
          position: 'sticky',
          bottom: 10,
          width: '100%',
          py: 2,
          borderTop: '1px solid rgba(238, 238, 238, .8)',
          background: (theme) => theme.palette.secondary.contrastText
        }}
      >
        <AnimateButton>
          <LoadingButton
            variant="contained"
            loading={formik.isSubmitting}
            disableElevation
            disabled={formik.isSubmitting}
            loadingPosition="start"
            onClick={formik.handleSubmit}
            sx={{ width: '150px' }}
          >
            {formik.isSubmitting ? (isEditMode ? 'Saving...' : 'Creating...') : isEditMode ? 'Save Changes' : 'Create'}
          </LoadingButton>
        </AnimateButton>
      </Stack>
    </React.Fragment>
  );
};

export default ReservationForm;
