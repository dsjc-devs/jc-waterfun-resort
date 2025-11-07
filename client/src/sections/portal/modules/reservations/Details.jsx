import React, { useMemo, useState, useEffect } from "react";
import exportReservationToPdf from "utils/exportReservationPdf";
import MainCard from "components/MainCard";
import {
  MailOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  PhoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Grid, Chip, Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ToggleButtonGroup, ToggleButton, Alert } from "@mui/material";
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { addHours } from 'date-fns';
import { PESO_SIGN } from "constants/constants";
import { useNavigate } from "react-router";

import LabeledValue from "components/LabeledValue";
import LongAccommodationCard from "components/accommodations/LongAccommodationCard";
import titleCase from "utils/titleCaseFormatter";
import formatPeso from "utils/formatPrice";
import useGetPosition from "hooks/useGetPosition";
import ConvertDate from "components/ConvertDate";
import textFormatter from "utils/textFormatter";
import AnimateButton from "components/@extended/AnimateButton";
import reservationsApi, { useGetSingleReservation } from "api/reservations";


const Details = ({ reservationData = {} }) => {
  const { isCustomer } = useGetPosition();
  const navigate = useNavigate();

  // Always call hooks first
  const reservationId = reservationData?.reservationId;
  const { mutate } = useGetSingleReservation(reservationId);

  const userData = reservationData?.userData;
  const accommodationData = reservationData?.accommodationData;
  const startDate = reservationData?.startDate;
  const endDate = reservationData?.endDate;
  const status = reservationData?.status;
  const entrances = reservationData?.entrances;
  const amount = reservationData?.amount;
  const guests = reservationData?.guests;
  const rescheduleRequest = reservationData?.rescheduleRequest;

  const paymentsStatus = amount?.totalPaid >= amount?.total;
  const paymentsStatusLabel = paymentsStatus ? 'FULLY_PAID' : (amount?.totalPaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID');

  // Reschedule UI state
  const [openResched, setOpenResched] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  // Reschedule inputs using MUI pickers
  const isGuestHouse = accommodationData?.type === 'guest_house';
  const initialMode = useMemo(() => {
    if (!endDate) return 'day';
    const endHour = new Date(endDate).getHours();
    return endHour === 17 ? 'day' : 'night';
  }, [endDate]);
  const [reschedMode, setReschedMode] = useState(initialMode);
  useEffect(() => setReschedMode(initialMode), [initialMode]);
  const [reschedDate, setReschedDate] = useState(startDate ? new Date(startDate) : null); // for day/night
  const [reschedDateTime, setReschedDateTime] = useState(startDate ? new Date(startDate) : null); // for guest house
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Only return null after all hooks are called
  if (!reservationData || !userData) return null;

  const isAtLeast2DaysBefore = (dateStr) => {
    const now = new Date();
    const start = new Date(dateStr);
    const diff = start.getTime() - now.getTime();
    return diff >= 2 * 24 * 60 * 60 * 1000;
  };

  const hasPendingResched = rescheduleRequest?.status === 'PENDING';
  const canRequestReschedule = isCustomer && status === 'CONFIRMED' && isAtLeast2DaysBefore(startDate) && !hasPendingResched;

  // Helpers similar to Reservation Form
  const applyModeStartTime = (dateLike, mode) => {
    if (!dateLike) return null;
    const d = new Date(dateLike);
    if (mode === 'day') d.setHours(7, 0, 0, 0);
    else d.setHours(17, 0, 0, 0);
    return d;
  };
  const computeModeEnd = (start, mode) => {
    if (!start) return null;
    const e = new Date(start);
    if (mode === 'day') {
      e.setHours(17, 0, 0, 0);
    } else {
      e.setDate(e.getDate() + 1);
      e.setHours(7, 0, 0, 0);
    }
    return e;
  };

  const handleSubmitReschedule = async () => {
    try {
      setSubmitting(true);
      let s, e;
      if (isGuestHouse) {
        if (!reschedDateTime) throw new Error('Please select a new start date and time.');
        s = new Date(reschedDateTime);
        e = addHours(s, accommodationData?.maxStayDuration || 10);
      } else {
        if (!reschedDate) throw new Error('Please select a new date.');
        s = applyModeStartTime(reschedDate, reschedMode);
        e = computeModeEnd(s, reschedMode);
      }
      await reservationsApi.Reservations.requestReschedule(reservationId, { newStartDate: s.toISOString(), newEndDate: e.toISOString() });
      toast.success("Reschedule request sent. Please wait for staff confirmation.");
      setOpenResched(false);
      setRejectReason("");
      await mutate();
    } catch (e) {
      toast.error(e.message || "Failed to submit reschedule request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await reservationsApi.Reservations.decideReschedule(reservationId, { action: 'APPROVE' });
      toast.success("Reschedule approved.");
      await mutate();
    } catch (e) {
      toast.error(e.message || "Failed to approve reschedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setSubmitting(true);
      await reservationsApi.Reservations.decideReschedule(reservationId, { action: 'REJECT', reason: rejectReason });
      setOpenReject(false);
      setRejectReason("");
      toast.success("Reschedule rejected.");
      await mutate();
    } catch (e) {
      toast.error(e.message || "Failed to reject reschedule.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <React.Fragment>
      <Stack direction='row' justifyContent='flex-end' spacing={2} marginBlock={2}>
        <AnimateButton>
          <Button
            variant='contained'
            onClick={() => exportReservationToPdf(reservationData, 'Show this to the receptionist upon entry to verify your reservation.')}
          >
            Export to PDF
          </Button>
        </AnimateButton>
        {!isCustomer && (
          <AnimateButton>
            <Button
              variant='contained'
              color='info'
              startIcon={<EditOutlined />}
              onClick={() => navigate(`/portal/reservations/form?isEditMode=true&reservationId=${reservationId}`)}
            >
              Edit
            </Button>
          </AnimateButton>
        )}
        {hasPendingResched && !isCustomer && (
          <Stack direction='row' spacing={1}>
            <AnimateButton>
              <Button disabled={submitting} variant='contained' color='success' onClick={handleApprove}>
                Approve Reschedule
              </Button>
            </AnimateButton>
            <AnimateButton>
              <Button disabled={submitting} variant='outlined' color='error' onClick={() => setOpenReject(true)}>
                Reject
              </Button>
            </AnimateButton>
          </Stack>
        )}
        {isCustomer && (
          <AnimateButton>
            <Button disabled={!canRequestReschedule || submitting} variant='contained' color='primary' onClick={() => setOpenResched(true)}>
              Request Reschedule
            </Button>
          </AnimateButton>
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MainCard>
            <MainCard title="Booking Information" sx={{ marginBottom: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <LabeledValue
                    ellipsis={true}
                    title="Reservation ID"
                    subTitle={reservationId}
                    icon={<IdcardOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="Status"
                    subTitle={
                      <Chip
                        size="small"
                        label={titleCase(status)}
                        color={
                          {
                            PENDING: "warning",
                            CONFIRMED: "primary",
                            COMPLETED: "success",
                            RESCHEDULED: "info",
                            ARCHIVED: "error",
                          }[status] || "default"
                        }
                      />
                    }
                    icon={<IdcardOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="Start Date"
                    subTitle={<ConvertDate dateString={startDate} time />}
                    icon={<CalendarOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="End Date"
                    subTitle={<ConvertDate dateString={endDate} time />}
                    icon={<CalendarOutlined />}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LabeledValue
                    title="Guests"
                    subTitle={`${guests} Guest${guests > 1 ? 's' : ''}`}
                    icon={<UserOutlined />}
                  />
                </Grid>
              </Grid>
            </MainCard>

            <MainCard title="Accommodation Information" sx={{ marginBottom: 2 }}>
              <LongAccommodationCard
                data={{ ...accommodationData, price: amount?.accommodationTotal }}
              />
            </MainCard>

            <MainCard title="Entrance Information" sx={{ marginBottom: 2 }}>
              <Grid container spacing={2}>
                {(!entrances?.adult && !entrances?.child && !entrances?.pwdSenior) ? (
                  <Grid item xs={12}>
                    <LabeledValue
                      title="No Entrance Tickets availed"
                      subTitle={"-"}
                      icon={<UserOutlined />}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={4}>
                      <LabeledValue
                        title="Adults"
                        subTitle={`${entrances?.adult || 0} (${formatPeso(
                          amount?.adult
                        )})`}
                        icon={<UserOutlined />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <LabeledValue
                        title="Children"
                        subTitle={`${entrances?.child || 0} (${formatPeso(
                          amount?.child
                        )})`}
                        icon={<UserOutlined />}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <LabeledValue
                        title="PWD / Senior"
                        subTitle={`${entrances?.pwdSenior || 0} (${formatPeso(
                          amount?.pwdSenior
                        )})`}
                        icon={<UserOutlined />}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </MainCard>

            {rescheduleRequest && (
              <MainCard title="Reschedule Information" sx={{ marginBottom: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      title="Request Status"
                      subTitle={<Chip size="small" label={titleCase(rescheduleRequest?.status || 'N/A')} color={{ PENDING: 'warning', APPROVED: 'success', REJECTED: 'error' }[rescheduleRequest?.status] || 'default'} />}
                      icon={<IdcardOutlined />}
                    />
                  </Grid>
                  {rescheduleRequest?.oldStartDate && (
                    <Grid item xs={12} md={6}>
                      <LabeledValue title="Original Dates" subTitle={<>
                        <ConvertDate dateString={rescheduleRequest?.oldStartDate} time /> - <ConvertDate dateString={rescheduleRequest?.oldEndDate} time />
                      </>} icon={<CalendarOutlined />} />
                    </Grid>
                  )}
                  {rescheduleRequest?.newStartDate && (
                    <Grid item xs={12} md={6}>
                      <LabeledValue title="Requested New Dates" subTitle={<>
                        <ConvertDate dateString={rescheduleRequest?.newStartDate} time /> - <ConvertDate dateString={rescheduleRequest?.newEndDate} time />
                      </>} icon={<CalendarOutlined />} />
                    </Grid>
                  )}
                </Grid>
              </MainCard>
            )}

            {!isCustomer && (
              <MainCard title="Customer Information">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="Full Name"
                      subTitle={`${userData.firstName} ${userData.lastName}`}
                      icon={<UserOutlined />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="User ID"
                      subTitle={userData.userId}
                      icon={<IdcardOutlined />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="Email Address"
                      subTitle={userData.emailAddress}
                      icon={<MailOutlined />}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LabeledValue
                      ellipsis={true}
                      title="Phone Number"
                      subTitle={
                        userData.phoneNumber ? `+63 ${userData.phoneNumber}` : "N/A"
                      }
                      icon={<PhoneOutlined />}
                    />
                  </Grid>
                </Grid>
              </MainCard>
            )}
          </MainCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MainCard
            title="Payment Information"
            sx={{ marginBottom: 1, flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Chip
              size='small'
              sx={{ width: '100%' }}
              label={textFormatter.fromSlug(titleCase(paymentsStatusLabel))}
              color={{
                FULLY_PAID: 'success',
                PARTIALLY_PAID: 'primary',
                UNPAID: 'error'
              }[paymentsStatusLabel] || 'default'}
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LabeledValue
                  title="Accommodation Total"
                  subTitle={formatPeso(amount?.accommodationTotal)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Entrance Total"
                  subTitle={formatPeso(amount?.entranceTotal)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Total Amount"
                  subTitle={formatPeso(amount?.total)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Extra Person Fee"
                  subTitle={formatPeso(amount?.extraPersonFee)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Minimum Payable Amount"
                  subTitle={formatPeso(amount?.minimumPayable)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Total Paid"
                  subTitle={formatPeso(amount?.totalPaid)}
                  icon={PESO_SIGN}
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledValue
                  title="Balance"
                  subTitle={formatPeso((amount?.total || 0) - (amount?.totalPaid || 0))}
                  icon={PESO_SIGN}
                />
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>

      {/* Reschedule Dialog */}
      <Dialog open={openResched} onClose={() => setOpenResched(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Reschedule</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {isGuestHouse ? (
                <DateTimePicker
                  value={reschedDateTime}
                  onChange={(val) => setReschedDateTime(val)}
                  disablePast
                  ampm
                  views={["year", "month", "day", "hours"]}
                  slotProps={{ textField: { fullWidth: true, label: 'New Start Date & Time' } }}
                />
              ) : (
                <>
                  <ToggleButtonGroup
                    value={reschedMode}
                    exclusive
                    onChange={(e, v) => v && setReschedMode(v)}
                    color="primary"
                    aria-label="time of day selection"
                  >
                    <ToggleButton value="day" aria-label="day mode">
                      <SunOutlined style={{ marginRight: 6 }} /> Day Tour (7 AM - 5 PM)
                    </ToggleButton>
                    <ToggleButton value="night" aria-label="night mode">
                      <MoonOutlined style={{ marginRight: 6 }} /> Night Tour (5 PM - 7 AM)
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <DatePicker
                    value={reschedDate}
                    onChange={(val) => setReschedDate(val)}
                    disablePast
                    slotProps={{ textField: { fullWidth: true, label: 'New Date' } }}
                  />
                </>
              )}
            </LocalizationProvider>
            <Alert severity="info">Your request will be reviewed by staff. It's subject to confirmation.</Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResched(false)}>Cancel</Button>
          <Button disabled={submitting} onClick={handleSubmitReschedule} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openReject} onClose={() => setOpenReject(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Reject Reschedule</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReject(false)}>Cancel</Button>
          <Button color="error" variant="contained" disabled={submitting} onClick={handleReject}>Reject</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Details;
