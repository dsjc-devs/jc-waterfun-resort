import React, { useState, useRef } from 'react';
import ReCaptcha from 'components/ReCaptcha';
import gcashLogo from 'assets/gcash.svg';
import mayaLogo from 'assets/maya.svg';
import {
  Container,
  Typography,
  Divider,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Card,
  CardContent
} from '@mui/material';
import { useGetSinglePolicy } from 'api/policies';

import LoadingButton from '@mui/lab/LoadingButton';
import MainCard from 'components/MainCard';
import Editor from 'components/Editor';
import formatPeso from 'utils/formatPrice';

const PaymentPage = ({
  totalPaid,
  setTotalPaid,
  handleCreateReservation,
  loading,
  bookingData,
  onCancel,
  // reCAPTCHA props
  recaptchaSiteKey,
  recaptchaTheme = 'light',
  recaptchaRef,
  recaptchaToken,
  setRecaptchaToken
}) => {
  const { data } = useGetSinglePolicy({ id: '68bb03b6329342f89eaa0870' })

  const [showMinAlert, setShowMinAlert] = useState(false);
  const [showMaxAlert, setShowMaxAlert] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [ackNoRefund, setAckNoRefund] = useState(false);
  const [canAcknowledge, setCanAcknowledge] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('gcash');
  const [showRecaptchaAlert, setShowRecaptchaAlert] = useState(false);
  const termsRef = useRef(null);
  const minPayable = bookingData?.amount?.minimumPayable || 1;
  const maxPayable = bookingData?.amount?.total || 1;

  const paymentMethods = [
    {
      value: 'gcash',
      label: 'GCash',
      description: 'Pay using your GCash wallet',
      icon: <img src={gcashLogo} alt="GCash" style={{ width: 32, height: 32 }} />
    },
    {
      value: 'maya',
      label: 'Maya (PayMaya)',
      description: 'Pay using your Maya account',
      icon: <img src={mayaLogo} alt="Maya" style={{ width: 32, height: 32 }} />
    },
  ];

  const handlePaidChange = (e) => {
    const value = e.target.value;
    const numValue = value === '' ? '' : Number(value);
    setTotalPaid(numValue);
    setShowMinAlert(value !== '' && numValue < minPayable);
    setShowMaxAlert(value !== '' && numValue > maxPayable);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayNowClick = () => {
    // If captcha is enabled but not solved, show alert and stop
    if (recaptchaSiteKey && !recaptchaToken) {
      setShowRecaptchaAlert(true);
      return;
    }

    setTermsOpen(true);
  };

  const handleTermsClose = () => {
    setTermsOpen(false);
  };

  const handlePay = () => {
    setTermsOpen(false);
    handleCreateReservation(selectedPaymentMethod);
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
      <Box mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Select Payment Method
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
                name="payment-method"
              >
                <Grid container spacing={2}>
                  {paymentMethods.map((method) => (
                    <Grid item xs={12} sm={6} md={6} key={method.value}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedPaymentMethod === method.value ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: '#1976d2',
                            boxShadow: 1
                          }
                        }}
                        onClick={() => setSelectedPaymentMethod(method.value)}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h4" sx={{ mr: 1 }}>
                              {method.icon}
                            </Typography>
                            <Radio
                              value={method.value}
                              checked={selectedPaymentMethod === method.value}
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {method.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Payment Amount
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
              You can only pay the minimum amount or more. Minimum payable: {formatPeso(minPayable)}, Maximum payable: {formatPeso(maxPayable)}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mt: 4, mb: 2 }} />

      {recaptchaSiteKey ? (
        <Box sx={{ my: 2 }}>
          <ReCaptcha
            ref={recaptchaRef}
            siteKey={recaptchaSiteKey}
            theme={recaptchaTheme}
            onChange={(token) => {
              setRecaptchaToken?.(token || '');
              if (token) setShowRecaptchaAlert(false);
            }}
            onExpired={() => {
              setRecaptchaToken?.('');
              setShowRecaptchaAlert(true);
            }}
          />
          {showRecaptchaAlert && !recaptchaToken ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Please complete the reCAPTCHA verification before continuing.
            </Alert>
          ) : null}
        </Box>
      ) : null}

      <React.Fragment>
        {showMinAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            The amount entered is less than the minimum payable. Please enter at least {formatPeso(minPayable)}.
          </Alert>
        )}
        {showMaxAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            The amount entered is more than the total price. Maximum payable: {formatPeso(maxPayable)}.
          </Alert>
        )}
      </React.Fragment>

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
          loadingPosition="start"
          style={{ width: '150px' }}
          disabled={
            loading ||
            !totalPaid ||
            Number(totalPaid) < minPayable ||
            Number(totalPaid) > maxPayable ||
            (!!recaptchaSiteKey && !recaptchaToken)
          }
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
