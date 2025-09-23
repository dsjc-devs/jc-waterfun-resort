import { Box, Typography, Stack, Alert } from "@mui/material";
import React from "react";
import MainCard from "components/MainCard";
import formatPeso from "utils/formatPrice";

const PaymentSummaryCard = ({ data, isDisplayBalance = false }) => {
  const {
    accomName,
    accomPrice,
    includeEntrance,
    entrances = {},
    entranceTotal,
    total,
    minimumPayable,
    prices = {},
    extraPersonFee = 0,
    guests = 0,
    capacity = 0,
    balance
  } = data;

  let perPersonFee = 0;
  if (extraPersonFee > 0 && guests > capacity) {
    perPersonFee = extraPersonFee / (guests - capacity);
  }

  return (
    <MainCard>
      <Typography variant="h4" gutterBottom>
        Payment Summary
      </Typography>

      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="body1" color="textSecondary">
          {accomName}
        </Typography>
        <Typography variant="body1">{formatPeso(accomPrice)}</Typography>
      </Stack>

      {extraPersonFee > 0 && (
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="body1" color="textSecondary">
            {`Extra Person Fee (${guests - capacity} x ${formatPeso(perPersonFee)})`}
          </Typography>
          <Typography variant="body1">
            {formatPeso(extraPersonFee)}
          </Typography>
        </Stack>
      )}

      {includeEntrance && (
        <React.Fragment>
          {entrances.adult > 0 && (
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                Adult x {entrances.adult}
              </Typography>
              <Typography variant="body1">
                {formatPeso(prices?.adult || 0)}
              </Typography>
            </Stack>
          )}

          {entrances.child > 0 && (
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                Children x {entrances.child}
              </Typography>
              <Typography variant="body1">
                {formatPeso(prices?.child || 0)}
              </Typography>
            </Stack>
          )}

          {entrances.pwdSenior > 0 && (
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                PWD/Senior x {entrances.pwdSenior}
              </Typography>
              <Typography variant="body1">
                {formatPeso(prices?.pwdSenior || 0)}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography variant="h5" fontWeight={600}>
              Entrance Subtotal
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {formatPeso(entranceTotal)}
            </Typography>
          </Stack>
        </React.Fragment>
      )}

      <Box sx={{ borderTop: "1px dashed #ddd", my: 2 }} />

      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h5" fontWeight={700}>
          Minimum Payable Now
        </Typography>
        <Typography variant="h5" fontWeight={700} color="success.dark">
          {formatPeso(minimumPayable)}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="h5" fontWeight={600}>
          Total
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {formatPeso(total)}
        </Typography>
      </Stack>

      {isDisplayBalance && (
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="h5" fontWeight={700}>
            Balance
          </Typography>
          <Typography variant="h5" fontWeight={700} color="error.main">
            {formatPeso(balance)}
          </Typography>
        </Stack>
      )}

      <Alert
        variant="standard"
        color="warning"
        severity="info"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Typography variant="body2" color="text.primary">
          You may pay exactly the <strong>{formatPeso(minimumPayable)} (Minimum Payable Now)</strong>, a higher amount,
          or even the full amount when confirming your booking.
        </Typography>
      </Alert>
    </MainCard>
  );
}

export default PaymentSummaryCard;
