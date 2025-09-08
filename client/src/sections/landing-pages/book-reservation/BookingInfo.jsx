import {
  Box,
  Button,
  Typography,
  Grid,
  Stack,
  TextField,
  Alert,
} from "@mui/material";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetResortRates } from "api/resort-rates";
import React, { useEffect, useMemo } from "react";

import MainCard from "components/MainCard";
import formatPeso from "utils/formatPrice";
import IconButton from "components/@extended/IconButton";
import LongAccommodationCard from "components/accommodations/LongAccommodationCard";
import PaymentSummaryCard from "components/accommodations/PaymentSummaryCard";

const BookingInfo = ({
  data,
  isDayMode,
  hasNoQuantities,
  startDate,
  endDate,
  mode,
  entrances,
  includeEntrance,
  onQuantitiesChange,
  onIncludeEntranceChange,
  onSetAmount,
  guests,
  onGuestsChange
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
    adult: getPrice("adult") * entrances.adult,
    child: getPrice("child") * entrances.child,
    pwdSenior: getPrice("pwdSenior") * entrances.pwdSenior
  }

  const entranceTotal = useMemo(() => {
    if (!resortRates) return 0;
    return (
      entranceAmounts.adult +
      entranceAmounts.child +
      entranceAmounts.pwdSenior
    );
  }, [entrances, resortRates, mode, includeEntrance]);

  const total = useMemo(() => {
    return price + entranceTotal;
  }, [price, entranceTotal]);

  const minimumPayable = useMemo(() => {
    const accomDownPayment = price * 0.5;
    return accomDownPayment;
  }, [price]);

  const totalQuantity = entrances.adult + entrances.child + entrances.pwdSenior;

  const capacity = data?.capacity || 0;
  const extraPersonFeeValue = data?.extraPersonFee || 0;
  const usedGuests = hasPoolAccess ? totalQuantity : guests;
  const extraPersonFee = (extraPersonFeeValue > 0 && usedGuests > capacity)
    ? (usedGuests - capacity) * extraPersonFeeValue
    : 0;

  const handleClearAll = () => {
    onQuantitiesChange({ adult: 0, child: 0, pwdSenior: 0 });
  };

  const handleIncrease = (type) => {
    const totalQuantity = entrances.adult + entrances.child + entrances.pwdSenior;
    if (totalQuantity < data.capacity) {
      onQuantitiesChange({ ...entrances, [type]: entrances[type] + 1 });
    }
  };

  const handleDecrease = (type) => {
    onQuantitiesChange({
      ...entrances,
      [type]: entrances[type] > 0 ? entrances[type] - 1 : 0,
    });
  };

  const handleQuantityChange = (type, value) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0) {
      const otherTypes = Object.keys(entrances).filter((t) => t !== type);
      const otherSum = otherTypes.reduce((sum, t) => sum + entrances[t], 0);

      if (numericValue + otherSum <= data.capacity) {
        onQuantitiesChange({ ...entrances, [type]: numericValue });
      } else {
        onQuantitiesChange({ ...entrances, [type]: data.capacity - otherSum });
      }
    } else if (value === "") {
      onQuantitiesChange({ ...entrances, [type]: 0 });
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
      extraPersonFee
    });
  }, [price, entranceTotal, total, minimumPayable, extraPersonFee, onSetAmount]);

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
                startDate,
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

            {/* Total Guests field for non-pool accommodations */}
            {!hasPoolAccess && (
              <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                  Total Guests
                </Typography>
                <TextField
                  type="number"
                  placeholder="Enter number of guests"
                  value={guests === 0 ? "" : guests}
                  onChange={e => {
                    const val = e.target.value;
                    onGuestsChange(val === "" ? 0 : Number(val));
                  }}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                {/* Show message if guests exceed capacity */}
                {guests > capacity && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    You have exceeded the maximum capacity ({capacity}). You will be charged an extra person fee of {formatPeso(extraPersonFeeValue)} for each additional guest.
                  </Alert>
                )}
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

                  {hasNoQuantities && (
                    <Typography
                      variant="body2"
                      color="error"
                      gutterBottom
                    >
                      Please select at least one guest and this could be up to {data?.capacity}
                    </Typography>
                  )}

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

                            {(type === "pwdSenior" && entrances.pwdSenior > 0) && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ fontStyle: "italic" }}
                              >
                                *Valid ID must be presented upon entry
                              </Typography>
                            )}
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Typography variant="h4">
                                {formatPeso(getPrice(type))}
                              </Typography>

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
                                  onChange={(e) =>
                                    handleQuantityChange(type, e.target.value)
                                  }
                                  inputProps={{
                                    style: { textAlign: "center", width: 40 },
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

                  {data?.capacity === totalQuantity && (
                    <Alert
                      severity="info"
                    >
                      Maximum capacity reached ({totalQuantity}/{data.capacity})
                    </Alert>
                  )}

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
              entrances,
              entranceTotal,
              minimumPayable,
              total: total + extraPersonFee,
              prices: {
                adult: entranceAmounts.adult,
                child: entranceAmounts.child,
                pwdSenior: entranceAmounts.pwdSenior
              },
              extraPersonFee,
              guests: usedGuests,
              capacity
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookingInfo;
