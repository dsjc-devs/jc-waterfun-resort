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

const steps = ["Choose Booking", "Enter Info", "Summary"];

const StepIcon = ({ active, completed }) => {
  if (completed) return <CheckCircleIcon color="success" />;
  if (active) return <MoreHorizIcon color="warning" />;
  return <CircleIcon color="disabled" />;
};

const BookReservation = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStep, setActiveStep] = useState(1);

  const [bookingData, setBookingData] = useState({
    accommodationData: {},
    startDate: "",
    endDate: "",
    mode: "day",
    quantities: { adult: 0, child: 0, pwdSenior: 0 },
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

  const queryParams = new URLSearchParams(location.search);
  const accommodationId = queryParams.get("accommodationId");
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");
  const mode = queryParams.get("mode") || "day";
  const isDayMode = mode === "day";

  const { data = {} } = useGetSingleAccommodation(accommodationId);

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

  console.log({
    bookingData,
    activeStep
  });

  return (
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

        {activeStep === 1 && (
          <BookingInfo
            data={data}
            startDate={bookingData.startDate}
            endDate={bookingData.endDate}
            isDayMode={isDayMode}
            mode={bookingData.mode}
            quantities={bookingData.quantities}
            includeEntrance={bookingData.includeEntranceFee}
            onQuantitiesChange={(newQuantities) =>
              saveBookingData({ ...bookingData, quantities: newQuantities })
            }
            onIncludeEntranceChange={(value) =>
              saveBookingData({ ...bookingData, includeEntranceFee: value })
            }
            onSetAmount={setAmount}
          />
        )}

        {activeStep === 2 && (
          <Summary
            bookingInfo={bookingData}
            onBack={handleBack}
            onConfirm={() => alert(`test`)}
          />
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  activeStep === 1 ? "flex-end" : "space-between",
                mt: 3,
              }}
            >
              {(activeStep !== 1) && (
                <Button onClick={handleBack} variant="outlined">
                  Back
                </Button>
              )}

              <AnimateButton>
                <LoadingButton
                  onClick={() => {
                    if (activeStep !== steps.length - 1) {
                      handleNext()
                    } else {
                      toast.success(`tanginaka`)
                    }
                  }}
                  variant="contained"
                  loading={false}
                  disableElevation
                  disabled={false}
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
      </Box>
    </Container>
  );
};

export default BookReservation;
