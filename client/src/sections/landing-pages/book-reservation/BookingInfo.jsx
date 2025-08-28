import React, { useMemo } from "react";
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

import MainCard from "components/MainCard";
import formatPeso from "utils/formatPrice";
import ConvertDate from "components/ConvertDate";
import IconButton from "components/@extended/IconButton";

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
}) => {
  const { resortRates } = useGetResortRates();

  const {
    thumbnail,
    name,
    capacity,
    maxStayDuration,
    price: accomPrice,
  } = data || {};

  const price = mode === "day" ? accomPrice?.day : accomPrice?.night;

  const getPrice = (type) => {
    if (!resortRates) return 0;
    return mode === "day"
      ? resortRates?.entranceFee?.[type]?.day || 0
      : resortRates?.entranceFee?.[type]?.night || 0;
  };

  const entranceTotal = useMemo(() => {
    if (!resortRates || !includeEntrance) return 0;
    return (
      getPrice("adult") * quantities.adult +
      getPrice("child") * quantities.child +
      getPrice("pwdSenior") * quantities.pwdSenior
    );
  }, [quantities, resortRates, mode, includeEntrance]);

  const total = useMemo(() => {
    return price + entranceTotal;
  }, [price, entranceTotal]);

  const minimumPayable = useMemo(() => {
    const accomDownPayment = price * 0.5;
    return accomDownPayment;
  }, [price]);

  const handleClearAll = () => {
    onQuantitiesChange({ adult: 0, child: 0, pwdSenior: 0 });
  };

  const handleIncrease = (type) => {
    onQuantitiesChange({ ...quantities, [type]: quantities[type] + 1 });
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
      onQuantitiesChange({ ...quantities, [type]: numericValue });
    } else if (value === "") {
      onQuantitiesChange({ ...quantities, [type]: 0 });
    }
  };

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
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box
                    component="img"
                    src={thumbnail}
                    sx={{
                      width: "100%",
                      objectFit: "cover",
                      aspectRatio: "16/9",
                      borderRadius: 1,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={9}>
                  <Typography variant="h5">{name}</Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: isDayMode ? "warning.main" : "primary.dark",
                    }}
                  >
                    {isDayMode ? "Day Tour" : "Night Tour"}
                  </Typography>

                  <Grid container spacing={2} mt={1} alignItems="center">
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Price:
                      </Typography>
                      <Typography variant="body1">
                        {formatPeso(price)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Capacity:
                      </Typography>
                      <Typography variant="body1">
                        {capacity || 0} guests
                      </Typography>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Max Hours:
                      </Typography>
                      <Typography variant="body1">
                        {maxStayDuration || 0} hours
                      </Typography>
                    </Grid>
                  </Grid>

                  {selectedDate && endDate && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Booking Dates:
                      </Typography>
                      <Typography variant="body1">
                        <ConvertDate dateString={selectedDate} time /> →{" "}
                        <ConvertDate dateString={endDate} time />
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {!includeEntrance && (
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
          </Box>

          {includeEntrance && (
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
          <MainCard>
            <Typography variant="h4" gutterBottom>
              Payment Summary
            </Typography>

            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                {name}
              </Typography>
              <Typography variant="body1">{formatPeso(price)}</Typography>
            </Stack>

            {includeEntrance && (
              <>
                {quantities.adult > 0 && (
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" color="textSecondary">
                      Adult x {quantities.adult}
                    </Typography>
                    <Typography variant="body1">
                      {formatPeso(getPrice("adult") * quantities.adult)}
                    </Typography>
                  </Stack>
                )}

                {quantities.child > 0 && (
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" color="textSecondary">
                      Children x {quantities.child}
                    </Typography>
                    <Typography variant="body1">
                      {formatPeso(getPrice("child") * quantities.child)}
                    </Typography>
                  </Stack>
                )}

                {quantities.pwdSenior > 0 && (
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" color="textSecondary">
                      PWD/Senior x {quantities.pwdSenior}
                    </Typography>
                    <Typography variant="body1">
                      {formatPeso(getPrice("pwdSenior") * quantities.pwdSenior)}
                    </Typography>
                  </Stack>
                )}

                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle1">Entrance Subtotal</Typography>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {formatPeso(entranceTotal)}
                  </Typography>
                </Stack>
              </>
            )}

            <Box sx={{ borderTop: "1px dashed #ddd", my: 2 }} />

            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{formatPeso(total)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5" fontWeight={700}>
                Minimum Payable Now
              </Typography>
              <Typography variant="h5" fontWeight={700} color="success.dark">
                {formatPeso(minimumPayable)}
              </Typography>
            </Stack>
          </MainCard>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BookingInfo;
