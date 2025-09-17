import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Grid,
  Divider,
  TextField,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";
import { useGetSingleAccommodation } from "api/accommodations";

import useAuth from "hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import BookingInfo from "sections/landing-pages/book-reservation/BookingInfo";
import Summary from "sections/landing-pages/book-reservation/Summary";
import AnimateButton from "components/@extended/AnimateButton";
import LoadingButton from "components/@extended/LoadingButton";
import PageTitle from "components/PageTitle";
import agent from "api";
import PaymentPage from "sections/landing-pages/book-reservation/PaymentPage";
import PaymentSummaryCard from "components/accommodations/PaymentSummaryCard";

const steps = ["Choose Booking", "Enter Info", "Summary", "Payment"];

const StepIcon = ({ active, completed }) => {
  if (completed) return <CheckCircleIcon color="success" />;
  if (active) return <MoreHorizIcon color="warning" />;
  return <CircleIcon color="disabled" />;
};

const BookReservation = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    accommodationData: {},
    startDate: "",
    endDate: "",
    mode: "day",
    guests: 0,
    entrances: { adult: 0, child: 0, pwdSenior: 0 },
    includeEntranceFee: false,
  });

  const [amount, setAmount] = useState({
    accommodationTotal: 0,
    entranceTotal: 0,
    adult: 0,
    child: 0,
    pwdSenior: 0,
    minimumPayable: 0,
    total: 0
  })

  const [totalPaid, setTotalPaid] = useState(0)

  const [loading, setLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const accommodationId = queryParams.get("accommodationId");
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");
  const mode = queryParams.get("mode") || "day";
  const isDayMode = mode === "day";
  const hasNoQuantities = bookingData?.accommodationData?.hasPoolAccess && Object.values(bookingData?.entrances || {}).reduce((sum, val) => sum + val, 0) === 0

  const { data = {} } = useGetSingleAccommodation(accommodationId);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    setBookingData((prev) => ({
      ...prev,
      amount,
      accommodationData: data,
      startDate,
      endDate,
      mode,
    }));

  }, [startDate, endDate, mode, data, amount, activeStep]);

  const saveBookingData = (data) => {
    sessionStorage.setItem("bookingData", JSON.stringify(data));
    setBookingData(data);
  };

  const handleGuestsChange = (guests) => {
    saveBookingData({ ...bookingData, guests });
  };

  const handleNext = () => {
    saveBookingData(bookingData);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/not-found");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookingData(parsed);
      } catch (err) {
        console.error("Failed to parse stored bookingData:", err);
      }
    }
  }, []);

  const handlePay = async (reservationId, amount) => {
    setLoading(true);
    try {
      const payload = {
        reservationId,
        amount: amount * 100,
        name: `${user?.firstName || ""} ${user?.lastName || ""}`,
        email: user?.emailAddress || "",
        phone: user?.phoneNumber || "",
        returnUrl: "http://localhost:3000/success-reservation",
      };

      const response = await agent.Payments.createPayment(payload);
      const data = response?.data || response;

      if (data.redirectUrl) {
        setRedirectUrl(data.redirectUrl);
        window.location.href = data.redirectUrl;
      } else {
        toast.error("No redirect URL received.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async () => {
    setLoading(true)
    try {
      const payload = {
        userId: user?.userId,
        userData: {
          ...user
        },
        accommodationId: bookingData.accommodationData?._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        status: "CONFIRMED",
        guests: bookingData?.accommodationData?.hasPoolAccess ? Object.values(bookingData?.entrances || {}).reduce((sum, val) => sum + val, 0) : bookingData?.guests,
        entrances: {
          adult: bookingData.entrances.adult,
          child: bookingData.entrances.child,
          pwdSenior: bookingData.entrances.pwdSenior
        },
        amount: {
          extraPersonFee: bookingData?.amount?.extraPersonFee || 0,
          accommodationTotal: bookingData?.amount?.accommodationTotal,
          entranceTotal: bookingData?.amount?.entranceTotal,
          total: (bookingData?.amount?.total || 0) + (bookingData?.amount?.extraPersonFee || 0),
          minimumPayable: bookingData?.amount?.minimumPayable,
          totalPaid,
          adult: bookingData?.amount?.adult,
          child: bookingData?.amount?.child,
          pwdSenior: bookingData?.amount?.pwdSenior
        }
      }

      const reservation = await agent.Reservations.createReservation(payload);

      await handlePay(reservation?.id || reservation?._id || "unknown", totalPaid);

      sessionStorage.removeItem("bookingData");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || `Error Occured. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <PageTitle title={`Book a Reservation | ${bookingData?.accommodationData?.name}`} isOnportal={false} />

      <Container>
        <Box sx={{ width: "100%", p: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel StepIconComponent={StepIcon}>
                  <Typography variant="subtitle1">{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Grid container spacing={2} flexDirection={isMobile ? "column-reverse" : "row"}>
            <Grid item xs={12} md={8}>
              <Box sx={{ my: 4 }}>
                {activeStep === 1 && (
                  <BookingInfo
                    data={data}
                    startDate={bookingData.startDate}
                    endDate={bookingData.endDate}
                    isDayMode={isDayMode}
                    hasNoQuantities={hasNoQuantities}
                    mode={bookingData.mode}
                    entrances={bookingData.entrances}
                    includeEntrance={bookingData.includeEntranceFee}
                    onQuantitiesChange={(newQuantities) =>
                      saveBookingData({ ...bookingData, entrances: newQuantities })
                    }
                    onIncludeEntranceChange={(value) =>
                      saveBookingData({ ...bookingData, includeEntranceFee: value })
                    }
                    onSetAmount={setAmount}
                    guests={bookingData.guests}
                    onGuestsChange={handleGuestsChange}
                  />
                )}

                {activeStep === 2 && (
                  <Summary
                    bookingInfo={bookingData}
                  />
                )}

                {activeStep === 3 && (
                  <PaymentPage
                    totalPaid={totalPaid}
                    setTotalPaid={setTotalPaid}
                    handleCreateReservation={handleCreateReservation}
                    loading={loading}
                    bookingData={bookingData}
                    onCancel={() => setActiveStep(2)}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ my: 4, position: 'sticky', top: 120 }}>
                <PaymentSummaryCard
                  data={{
                    accomName: bookingData?.accommodationData?.name,
                    accomPrice: amount?.accommodationTotal,
                    includeEntrance: bookingData?.includeEntranceFee || bookingData?.accommodationData?.hasPoolAccess,
                    entrances: bookingData?.entrances,
                    entranceTotal: amount?.entranceTotal,
                    total: amount?.total,
                    minimumPayable: amount?.minimumPayable,
                    prices: {
                      adult: amount?.adult,
                      child: amount?.child,
                      pwdSenior: amount?.pwdSenior
                    },
                    extraPersonFee: amount?.extraPersonFee,
                    guests: bookingData?.guests,
                    capacity: bookingData?.accommodationData?.capacity
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {activeStep < 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Button onClick={() => activeStep === 1 ? navigate(`/accommodations/details/${data?._id}`) : handleBack()} variant="outlined">
                    Back
                  </Button>

                  <AnimateButton>
                    <LoadingButton
                      onClick={() => {
                        if (activeStep !== steps.length - 1) {
                          handleNext()
                        } else {
                          setActiveStep(3)
                        }
                      }}
                      variant="contained"
                      disableElevation
                      disabled={hasNoQuantities}
                      loadingPosition="start"
                      fullWidth
                      color="primary"
                      sx={{ width: "200px" }}
                    >
                      {activeStep === steps.length - 1 ? "Confirm Booking" : "Next"}
                    </LoadingButton>
                  </AnimateButton>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default BookReservation;
