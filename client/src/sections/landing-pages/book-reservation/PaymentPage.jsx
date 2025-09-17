import React, { useState, useRef } from 'react';
import { Container, Typography, Divider, Box, Grid, TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MainCard from 'components/MainCard';
import Editor from 'components/Editor';

const staticTNC = `
<h3>Terms and Conditions - John Cezar Waterfun Resort</h3>
<p>
  Please read the following Terms and Conditions carefully before making a reservation and proceeding with your payment. 
  By confirming your booking and paying the required amount, you acknowledge that you have read, understood, and agreed 
  to these terms.
</p>

<h4>1. Reservation and Payment</h4>
<ul>
  <li>A reservation is considered valid only after the minimum payable amount has been received by the resort.</li>
  <li>The minimum payable amount is non-refundable and will be deducted from the total reservation fee.</li>
  <li>Guests may pay more than the minimum amount, but full settlement of the balance must be completed before check-in.</li>
  <li>All payments must be made through the authorized payment channels provided by John Cezar Waterfun Resort.</li>
</ul>

<h4>2. Cancellation and Refund Policy</h4>
<ul>
  <li>All payments made are strictly <b>non-refundable</b>.</li>
  <li>In the event of cancellation or no-show, payments will not be returned but may be considered for rebooking at the resort’s discretion, subject to availability.</li>
  <li>Rebooking requests must be made at least 7 days prior to the original booking date and may incur additional charges.</li>
</ul>

<h4>3. Resort Policies</h4>
<ul>
  <li>Guests must present a valid booking confirmation and identification upon arrival.</li>
  <li>The resort reserves the right to deny entry if guests fail to comply with resort rules and regulations.</li>
  <li>Check-in and check-out times must be strictly observed. Early check-in or late check-out may incur additional fees.</li>
  <li>Guests are expected to maintain cleanliness and proper conduct within the premises.</li>
</ul>

<h4>4. Liability and Safety</h4>
<ul>
  <li>John Cezar Waterfun Resort is not responsible for loss, theft, or damage to guests’ personal belongings.</li>
  <li>Guests must take full responsibility for their safety while using resort facilities, including swimming pools, cottages, and recreational areas.</li>
  <li>Children must be supervised by adults at all times.</li>
  <li>The resort will not be liable for injuries or accidents resulting from negligence or failure to follow safety rules.</li>
</ul>

<h4>5. Force Majeure</h4>
<ul>
  <li>The resort shall not be held liable for cancellations or interruptions due to events beyond its control, including natural disasters, government restrictions, or unforeseen emergencies.</li>
  <li>In such cases, rebooking may be offered subject to availability and resort management approval.</li>
</ul>

<h4>6. Guest Responsibilities</h4>
<ul>
  <li>Guests are liable for any damage to resort property caused by negligence, misconduct, or violation of rules.</li>
  <li>Strictly no bringing of illegal substances, weapons, or hazardous items within the resort premises.</li>
  <li>Excessive noise or disturbance to other guests may result in removal from the premises without refund.</li>
</ul>

<h4>7. Agreement</h4>
<p>
  By completing your reservation and payment, you agree to abide by all the terms and conditions outlined above. 
  John Cezar Waterfun Resort reserves the right to update these terms at any time without prior notice.
</p>

`

const PaymentPage = ({
  totalPaid,
  setTotalPaid,
  handleCreateReservation,
  loading,
  bookingData,
  onCancel
}) => {
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
                value: staticTNC
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
