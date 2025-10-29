import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Divider, Typography, Box, Grid, TextField, Button, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const PaymentDialog = ({
  openPayModal,
  setOpenPayModal,
  totalPaid,
  setTotalPaid,
  handleCreateReservation,
  loading,
  bookingData
}) => {
  const [showMinAlert, setShowMinAlert] = useState(false);
  const minPayable = bookingData?.amount?.minimumPayable || 1;

  const handlePaidChange = (e) => {
    const value = e.target.value;
    // Allow empty string for clearing the field
    setTotalPaid(value === '' ? '' : Number(value));
    setShowMinAlert(value !== '' && Number(value) < minPayable);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={openPayModal} onClose={() => setOpenPayModal(false)}>
      <DialogTitle>Payment</DialogTitle>
      <Divider />

      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Complete your reservation payment
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please enter the amount you wish to pay for your reservation. You must pay at least the minimum payable amount to confirm your booking.
          You may pay more if you wish. Once payment is made, your reservation will be processed and confirmed.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <strong>Instructions:</strong> <br />
          1. Enter your payment amount in the field below.<br />
          2. Click "Pay Now" to complete your reservation.<br />
          3. You will receive a confirmation once your payment is successful.
        </Typography>
        {showMinAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            The amount entered is less than the minimum payable. Please enter at least ₱{minPayable}.
          </Alert>
        )}
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography>
                Amount
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                value={totalPaid}
                type="number"
                onChange={handlePaidChange}
                inputProps={{
                  min: minPayable
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You can only pay the minimum amount or more. Minimum payable: ₱{minPayable}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={() => setOpenPayModal(false)} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>

        <LoadingButton
          onClick={handleCreateReservation}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
          loading={loading}
          disableElevation
          // disabled={loading || !totalPaid || Number(totalPaid) < minPayable}
          loadingPosition="start"
          fullWidth
          style={{ width: '150px' }}
        >
          Pay Now
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog;