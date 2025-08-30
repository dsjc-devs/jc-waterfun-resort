import { Box, Typography, Stack } from "@mui/material";

import React from "react";
import MainCard from "components/MainCard";
import formatPeso from "utils/formatPrice";

const PaymentSummaryCard = ({ data }) => {
  const {
    accomName,
    accomPrice,
    includeEntrance,
    quantities = {},
    entranceTotal,
    total,
    minimumPayable,
    prices = {}
  } = data;

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

      {includeEntrance && (
        <React.Fragment>
          {quantities.adult > 0 && (
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                Adult x {quantities.adult}
              </Typography>
              <Typography variant="body1">
                {formatPeso(prices?.adult || 0)}
              </Typography>
            </Stack>
          )}

          {quantities.child > 0 && (
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                Children x {quantities.child}
              </Typography>
              <Typography variant="body1">
                {formatPeso(prices?.child || 0)}
              </Typography>
            </Stack>
          )}

          {quantities.pwdSenior > 0 && (
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="body1" color="textSecondary">
                PWD/Senior x {quantities.pwdSenior}
              </Typography>
              <Typography variant="body1">
                {formatPeso(prices?.pwdSenior || 0)}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography variant="h5">Entrance Subtotal</Typography>
            <Typography variant="h5" fontWeight={600}>
              {formatPeso(entranceTotal)}
            </Typography>
          </Stack>
        </React.Fragment>
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
  );
};

export default PaymentSummaryCard;
