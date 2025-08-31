import {
  Box,
  Button,
  Typography,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetResortRates } from "api/resortRates";
import React, { useEffect, useMemo } from "react";

import MainCard from "components/MainCard";
import formatPeso from "utils/formatPrice";
import IconButton from "components/@extended/IconButton";
import LongAccommodationCard from "components/accommodations/LongAccommodationCard";
import PaymentSummaryCard from "components/accommodations/PaymentSummaryCard";

const BookingInfo = ({
  data,
  isDayMode,
  selectedDate,
  endDate,
  mode,
  quantities,
  includeEntrance,
  onQuantitiesChange,
  onIncludeEntranceChange,
  onSetAmount
}) => {
  const { resortRates } = useGetResortRates();

  const {
    name,
    price: accomPrice,
    hasPoolAccess
  } = data || {};

  const price = mode === "day" ? accomPrice?.day : accomPrice?.night;

  const getPrice = (type) => {
    if (!resortRates) return 0;
    return mode === "day"
      ? resortRates?.entranceFee?.[type]?.day || 0
      : resortRates?.entranceFee?.[type]?.night || 0;
  };

  const entranceAmounts = {
    adult: getPrice("adult") * quantities.adult,
    child: getPrice("child") * quantities.child,
    pwdSenior: getPrice("pwdSenior") * quantities.pwdSenior
  }

  const entranceTotal = useMemo(() => {
    if (!resortRates) return 0;
    return (
      entranceAmounts.adult +
      entranceAmounts.child +
      entranceAmounts.pwdSenior
    );
  }, [quantities, resortRates, mode, includeEntrance]);

  const total = useMemo(() => {
    return price + entranceTotal;
  }, [price, entranceTotal]);

  const minimumPayable = useMemo(() => {
    const accomDownPayment = price * 0.5;
    return accomDownPayment;
  }, [price]);

  const totalQuantity = quantities.adult + quantities.child + quantities.pwdSenior;

  const handleClearAll = () => {
    onQuantitiesChange({ adult: 0, child: 0, pwdSenior: 0 });
  };

  const handleIncrease = (type) => {
    const totalQuantity = quantities.adult + quantities.child + quantities.pwdSenior;
    if (totalQuantity < data.capacity) {
      onQuantitiesChange({ ...quantities, [type]: quantities[type] + 1 });
    }
  };

  const handleDecrease = (type) => {
    onQuantitiesChange({
      ...quantities,
      [type]: quantities[type] > 0 ? quantities[type] - 1 : 0,
    });
  };

  const handleQuantityChange = (type, value) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      const otherTypes = Object.keys(quantities).filter((t) => t !== type);
      const otherSum = otherTypes.reduce((sum, t) => sum + quantities[t], 0);

      if (numericValue + otherSum <= data.capacity) {
        onQuantitiesChange({ ...quantities, [type]: numericValue });
      } else {
        onQuantitiesChange({ ...quantities, [type]: data.capacity - otherSum });
      }
    } else if (value === "") {
      onQuantitiesChange({ ...quantities, [type]: 0 });
    }
  };

  useEffect(() => {
    onSetAmount({
      accommodationTotal: price || 0,
      entranceTotal,
      total,
      minimumPayable,
      adult: entranceAmounts.adult,
      child: entranceAmounts.child,
      pwdSenior: entranceAmounts.pwdSenior,
    });
  }, [price, entranceTotal, total, minimumPayable, onSetAmount]);

  return (
    <Grid
      container
      spacing={2}
      marginBlockStart={4}
      sx={{
        flexDirection: { xs: "column-reverse", md: "row" },
      }}
    >
      <Grid item xs={12} md={8}>
        <Box sx={{ bgcolor: "#fff", borderRadius: 3 }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
            <Typography variant="h3"> Enter Info </Typography>
          </Box>

          <Box sx={{ borderBottom: "1px solid #eee", p: 2 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                pl: 2,
                borderLeft: (theme) =>
                  `5px solid ${theme.palette.primary.light}`,
              }}
            >
              Accommodation Info
            </Typography>

            <MainCard>
              <LongAccommodationCard data={{
                ...data,
                price,
                isDayMode,
                selectedDate,
                endDate
              }} />

              {!hasPoolAccess && (
                <Box mt={2}>
                  <Typography
                    variant="body2"
                    color="error"
                    fontWeight={500}
                    fontStyle="italic"
                  >
                    Disclaimer: Pool Entrance fee is not yet included in this
                    booking.
                  </Typography>
                </Box>
              )}
            </MainCard>

            {!hasPoolAccess && (
              <Box mt={2}>
                <Stack alignItems="center" marginBlock={4}>
                  {!includeEntrance ? (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PlusOutlined />}
                      onClick={() => onIncludeEntranceChange(true)}
                    >
                      Buy Pool Entrance Tickets
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<MinusOutlined />}
                      onClick={() => onIncludeEntranceChange(false)}
                    >
                      Cancel Pool Entrance Tickets
                    </Button>
                  )}
                </Stack>
              </Box>
            )}
          </Box>

          {(includeEntrance || hasPoolAccess) && (
            <Box sx={{ borderBottom: "1px solid #eee", p: 2, mt: 2 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  pl: 2,
                  borderLeft: (theme) =>
                    `5px solid ${theme.palette.primary.light}`,
                }}
              >
                Pool Entrance Tickets
              </Typography>

              <Typography variant="subtitle2" color="warning.main">
                Capacity: {data.capacity} | Selected: {totalQuantity}
              </Typography>

              <MainCard>
                <Box marginBlockEnd={5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body1"
                      color="secondary"
                      gutterBottom
                    >
                      Quantity
                    </Typography>

                    <Button
                      size="small"
                      variant="text"
                      sx={{ textDecoration: "underline" }}
                      color="secondary"
                      onClick={handleClearAll}
                    >
                      Clear All
                    </Button>
                  </Stack>

                  {["adult", "child", "pwdSenior"].map((type) => (
                    <Box key={type} sx={{ my: 2 }}>
                      <MainCard>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={6}>
                            <Typography variant="h5" fontWeight={700}>
                              {type === "adult"
                                ? "Adult"
                                : type === "child"
                                  ? "Children"
                                  : "PWD/Senior"}
                            </Typography>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Typography variant="h4">
                                {formatPeso(getPrice(type))}
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <IconButton
                                  variant="outlined"
                                  onClick={() => handleDecrease(type)}
                                  disabled={quantities[type] === 0}
                                  color="primary"
                                >
                                  <MinusOutlined />
                                </IconButton>

                                <TextField
                                  value={quantities[type]}
                                  size="small"
                                  onChange={(e) =>
                                    handleQuantityChange(type, e.target.value)
                                  }
                                  inputProps={{
                                    style: {
                                      textAlign: "center",
                                      width: 40,
                                    },
                                  }}
                                />

                                <IconButton
                                  variant="outlined"
                                  onClick={() => handleIncrease(type)}
                                  color="primary"
                                >
                                  <PlusOutlined />
                                </IconButton>
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Box>
                  ))}
                </Box>
              </MainCard>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box sx={{ position: "sticky", top: 100 }}>
          <PaymentSummaryCard
            data={{
              accomName: name,
              accomPrice: price,
              includeEntrance: includeEntrance || hasPoolAccess,
              quantities,
              entranceTotal,
              minimumPayable,
              total,
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
  );
};

export default BookingInfo;
