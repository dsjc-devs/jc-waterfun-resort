import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const paymentStatus = urlParams.get('redirect_status');

    if (paymentStatus === 'succeeded') {
      setStatus('success');
      setMessage('Payment successful! Your reservation has been confirmed.');
    } else if (paymentStatus === 'failed') {
      setStatus('failed');
      setMessage('Payment failed. Please try again.');
    } else {
      const storedPaymentIntentId = sessionStorage.getItem('paymentIntentId');

      if (paymentIntentId || storedPaymentIntentId) {
        setTimeout(() => {
          setStatus('success');
          setMessage('Payment successful! Your reservation has been confirmed.');
          sessionStorage.removeItem('paymentIntentId');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage('No payment information found.');
      }
    }
  }, [location]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewReservations = () => {
    navigate('/portal/reservations');
  };

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <Box textAlign="center">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Processing Payment
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom color="success.main">
              Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleViewReservations}>
                View My Reservations
              </Button>
              <Button variant="outlined" onClick={handleGoHome}>
                Go to Homepage
              </Button>
            </Box>
          </Box>
        );

      case 'failed':
        return (
          <Box textAlign="center">
            <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error.main">
              Payment Failed
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              Your reservation was not created. No charges were made to your account.
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={() => navigate('/accommodations')}>
                Try Again
              </Button>
              <Button variant="outlined" onClick={handleGoHome}>
                Go to Homepage
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6 }}>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default PaymentResult;