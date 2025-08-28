import useAuth from "hooks/useAuth";
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
import { useGetSingleAccommodation } from "api/accommodations";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CircleIcon from "@mui/icons-material/Circle";
import BookingInfo from "sections/landing-pages/book-reservation/BookingInfo";
import Summary from "sections/landing-pages/book-reservation/Summary";

const steps = ["Choose Booking", "Enter Info", "Pay"];

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
    accommodationId: "",
    selectedDate: "",
    endDate: "",
    mode: "day",
    quantities: { adult: 0, child: 0, pwdSenior: 0 },
    includeEntranceFee: false,
  });

  const queryParams = new URLSearchParams(location.search);
  const accommodationId = queryParams.get("accommodationId");
  const selectedDate = queryParams.get("selectedDate");
  const endDate = queryParams.get("endDate");
  const mode = queryParams.get("mode") || "day";
  const isDayMode = mode === "day";

  const { data = {}, isLoading } = useGetSingleAccommodation(accommodationId);

  useEffect(() => {
    setBookingData((prev) => ({
      ...prev,
      accommodationId,
      selectedDate,
      endDate,
      mode,
    }));
  }, [accommodationId, selectedDate, endDate, mode]);

  const saveBookingData = (data) => {
    sessionStorage.setItem("bookingData", JSON.stringify(data));
    setBookingData(data);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      saveBookingData(bookingData);
    }
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
            selectedDate={bookingData.selectedDate}
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
          />
        )}

        {activeStep === 2 && (
          <Summary
            bookingInfo={bookingData}
            onBack={handleBack}
            onConfirm={() => alert(`tanginamo`)}
          />
        )}

        {activeStep !== 2 && (
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

                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={activeStep === steps.length - 1}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default BookReservation;
