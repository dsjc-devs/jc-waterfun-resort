import React, { useEffect, useState, useRef } from "react";
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
  useTheme,
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
    amenitiesQuantities: {},
  });

  const [amount, setAmount] = useState({
    accommodationTotal: 0,
    entranceTotal: 0,
    amenitiesTotal: 0,
    adult: 0,
    child: 0,
    pwdSenior: 0,
    minimumPayable: 0,
    extraPersonFee: 0,
    total: 0
  })

  const [totalPaid, setTotalPaid] = useState(0)

  const [loading, setLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const accommodationId = queryParams.get("accommodationId");
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");
  const mode = queryParams.get("mode") || "day";
  const isDayMode = mode === "day";
  const hasNoQuantities = bookingData?.accommodationData?.hasPoolAccess && Object.values(bookingData?.entrances || {}).reduce((sum, val) => sum + val, 0) === 0

  const { data = {} } = useGetSingleAccommodation(accommodationId);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const muiTheme = useTheme();
  const recaptchaTheme = muiTheme?.palette?.mode === 'dark' ? 'dark' : 'light';
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  const calculatedTotal = (amount.accommodationTotal || 0) + (amount.entranceTotal || 0) + (amount.amenitiesTotal || 0) + (amount.extraPersonFee || 0);

  useEffect(() => {
    setBookingData((prev) => ({
      ...prev,
      amount: {
        ...amount,
        total: calculatedTotal
      },
      accommodationData: data,
      startDate,
      endDate,
      mode,
    }));
  }, [startDate, endDate, mode, data, amount.accommodationTotal, amount.entranceTotal, amount.extraPersonFee, amount.adult, amount.child, amount.pwdSenior, amount.minimumPayable, activeStep, calculatedTotal]);

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

  const handleCreateReservation = async (paymentMethod = 'gcash') => {
    // Gate payment with ReCAPTCHA
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";
    if (siteKey && !recaptchaToken) {
      toast.error("Please complete the captcha before proceeding.");
      return;
    }
    setLoading(true)
    try {
      const computedMode = bookingData?.mode || mode;
      const bookingPayload = {
        userId: user?.userId,
        userData: {
          ...user
        },
        accommodationId: bookingData.accommodationData?._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        // send both for server-side handling of fixed night times
        mode: computedMode,
        isDayMode: computedMode === 'day',
        guests: bookingData?.accommodationData?.hasPoolAccess ? Object.values(bookingData?.entrances || {}).reduce((sum, val) => sum + val, 0) : bookingData?.guests,
        entrances: {
          adult: bookingData.entrances.adult,
          child: bookingData.entrances.child,
          pwdSenior: bookingData.entrances.pwdSenior
        },
        // Provide amenities via items for server enrichment
        amenitiesItems: Object.entries(bookingData?.amenitiesQuantities || {})
          .map(([amenityId, quantity]) => ({ amenityId, quantity: Number(quantity || 0) }))
          .filter((it) => it.quantity > 0),
        amount: {
          extraPersonFee: bookingData?.amount?.extraPersonFee || 0,
          accommodationTotal: bookingData?.amount?.accommodationTotal,
          entranceTotal: bookingData?.amount?.entranceTotal,
          amenitiesTotal: bookingData?.amount?.amenitiesTotal || 0,
          total: calculatedTotal,
          minimumPayable: bookingData?.amount?.minimumPayable,
          totalPaid,
          adult: bookingData?.amount?.adult,
          child: bookingData?.amount?.child,
          pwdSenior: bookingData?.amount?.pwdSenior
        }
      }

      const paymentPayload = {
        amount: totalPaid * 100,
        name: `${user?.firstName || ""} ${user?.lastName || ""}`,
        email: user?.emailAddress || "",
        phone: user?.phoneNumber || "",
        returnUrl: `${window.location.origin}/payment-result`,
        paymentMethod,
        bookingData: bookingPayload,
        // Include recaptcha token for backend verification (if supported)
        recaptchaToken: recaptchaToken || undefined,
      };

      const response = await agent.Payments.createPaymentWithBooking(paymentPayload);
      const data = response?.data || response;

      if (data.redirectUrl) {
        setRedirectUrl(data.redirectUrl);
        sessionStorage.setItem("paymentIntentId", data.paymentIntentId);
        sessionStorage.removeItem("bookingData");
        window.location.href = data.redirectUrl;
      } else {
        toast.error("No redirect URL received.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || `Error Occured. Please try again.`)
    } finally {
      setLoading(false)
      // Reset captcha after an attempt
      try { recaptchaRef.current?.reset(); } catch { }
      setRecaptchaToken("");
    }
  }

  return (
    <React.Fragment>
      <PageTitle title={`Book a Reservation | ${bookingData?.accommodationData?.name}`} isOnportal={false} />

      <Container>
        <Box sx={{ width: "100%", p: 3 }}>
          {isMobile ? (
            <Box
              sx={{
                mb: 2,
                overflowX: "auto",
                maxWidth: "100%",
                px: 1,
                display: "flex",
                justifyContent: "center"
              }}
            >
              {(() => {
                let start = activeStep - 1;
                if (start < 0) start = 0;
                if (start > steps.length - 2) start = steps.length - 2;
                const visibleSteps = steps.slice(start, start + 2);
                return (
                  <Stepper
                    activeStep={activeStep - start}
                    orientation="horizontal"
                    sx={{
                      minWidth: 250,
                      flexWrap: "nowrap",
                      width: "fit-content"
                    }}
                  >
                    {visibleSteps.map((label, idx) => (
                      <Step key={start + idx}>
                        <StepLabel StepIconComponent={StepIcon}>
                          <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                );
              })()}
            </Box>
          ) : (
            <Box
              sx={{
                mb: 2,
                overflowX: "auto",
                maxWidth: "100%",
                px: { xs: 1, sm: 0 }
              }}
            >
              <Stepper
                activeStep={activeStep}
                orientation="horizontal"
                sx={{
                  minWidth: { xs: 400, sm: 0 },
                  flexWrap: "nowrap",
                }}
              >
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel StepIconComponent={StepIcon}>
                      <Typography variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

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
                    amenitiesQuantities={bookingData.amenitiesQuantities}
                    onAmenitiesChange={(next) => saveBookingData({ ...bookingData, amenitiesQuantities: next })}
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
                    // reCAPTCHA props for rendering within the page (moved down)
                    recaptchaSiteKey={recaptchaSiteKey}
                    recaptchaTheme={recaptchaTheme}
                    recaptchaRef={recaptchaRef}
                    recaptchaToken={recaptchaToken}
                    setRecaptchaToken={setRecaptchaToken}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ my: 4, position: 'sticky', top: 120 }}>
                <PaymentSummaryCard
                  isDisplayBalance={false}
                  data={{
                    accomName: bookingData?.accommodationData?.name,
                    accomPrice: amount?.accommodationTotal,
                    includeEntrance: bookingData?.includeEntranceFee || bookingData?.accommodationData?.hasPoolAccess,
                    entrances: bookingData?.entrances,
                    entranceTotal: amount?.entranceTotal,
                    amenitiesTotal: amount?.amenitiesTotal,
                    total: calculatedTotal,
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
