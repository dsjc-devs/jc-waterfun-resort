import React, { useState, useRef } from 'react';
import { Container, Typography, Divider, Box, Grid, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import { useGetSinglePolicy } from 'api/policies';

import LoadingButton from '@mui/lab/LoadingButton';
import MainCard from 'components/MainCard';
import Editor from 'components/Editor';

const PaymentPage = ({
  totalPaid,
  setTotalPaid,
  handleCreateReservation,
  loading,
  bookingData,
  onCancel
}) => {
  const { data } = useGetSinglePolicy({ id: '68bb03b6329342f89eaa0870' })

  const [showMinAlert, setShowMinAlert] = useState(false);
  const [showMaxAlert, setShowMaxAlert] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [ackNoRefund, setAckNoRefund] = useState(false);
  const [canAcknowledge, setCanAcknowledge] = useState(false);
  const termsRef = useRef(null);
  const minPayable = bookingData?.amount?.minimumPayable || 1;
  const maxPayable = bookingData?.amount?.total || 1;

  const handlePaidChange = (e) => {
    const value = e.target.value;
    const numValue = value === '' ? '' : Number(value);
    setTotalPaid(numValue);
    setShowMinAlert(value !== '' && numValue < minPayable);
    setShowMaxAlert(value !== '' && numValue > maxPayable);
  };

  const handlePayNowClick = () => {
    setTermsOpen(true);
  };

  const handleTermsClose = () => {
    setTermsOpen(false);
  };

  const handlePay = () => {
    setTermsOpen(false);
    handleCreateReservation();
  };

  const handleScroll = () => {
    const el = termsRef.current;
    if (!el) return;
    // Only enable if scrollable and at bottom
    const isScrollable = el.scrollHeight > el.clientHeight + 1;
    const isBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;
    setCanAcknowledge(isScrollable ? isBottom : true);
  };

  const handleDialogEntered = () => {
    setCanAcknowledge(false);
    setAckNoRefund(false);
    if (termsRef.current) {
      termsRef.current.scrollTop = 0;
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Payment
      </Typography>
      <Divider sx={{ mb: 2 }} />

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
      {showMaxAlert && (
        <Alert severity="error" sx={{ mb: 2 }}>
          The amount entered is more than the total price. Maximum payable: ₱{maxPayable}.
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
                min: minPayable,
                max: maxPayable
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              You can only pay the minimum amount or more. Minimum payable: ₱{minPayable}, Maximum payable: ₱{maxPayable}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mt: 4, mb: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>

        <LoadingButton
          onClick={handlePayNowClick}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
          loading={loading}
          disableElevation
          disabled={
            loading ||
            !totalPaid ||
            Number(totalPaid) < minPayable ||
            Number(totalPaid) > maxPayable
          }
          loadingPosition="start"
          style={{ width: '150px' }}
        >
          Pay Now
        </LoadingButton>
      </Box>

      <Dialog
        open={termsOpen}
        onClose={handleTermsClose}
        maxWidth="sm"
        fullWidth
        onEntered={handleDialogEntered}
      >
        <DialogTitle>
          <Typography variant="h3">
            Terms and Conditions
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <MainCard
            sx={{
              minHeight: 100,
              maxHeight: 350,
              overflowY: 'auto'
            }}
            ref={termsRef}
            onScroll={handleScroll}
          >
            <Editor
              readonly={true}
              content={{
                value: data?.content || ''
              }}
            />
          </MainCard>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ackNoRefund}
                  onChange={e => setAckNoRefund(e.target.checked)}
                  name="ackNoRefund"
                  color="primary"
                  disabled={!canAcknowledge}
                />
              }
              label={
                canAcknowledge
                  ? "I agree to the terms and conditions."
                  : "Scroll to the bottom to enable agreement."
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTermsClose} variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            onClick={handlePay}
            variant="contained"
            color="primary"
            loading={loading}
            disableElevation
            loadingPosition="start"
            disabled={!ackNoRefund}
          >
            Pay
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;
