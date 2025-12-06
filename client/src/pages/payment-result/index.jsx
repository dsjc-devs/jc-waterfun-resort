import React, { useEffect, useRef, useState } from 'react';
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
import agent from 'api';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [reservationId, setReservationId] = useState(null);
  const pollTimerRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const MAX_ATTEMPTS = 5;
    const POLL_INTERVAL = 3000;
    let attempts = 0;

    const urlParams = new URLSearchParams(location.search);
    // PayMongo returns payment_intent_id (and sometimes payment_intent)
    const intentFromUrl =
      urlParams.get('payment_intent_id') ||
      urlParams.get('payment_intent') ||
      urlParams.get('pi');
    const paymentIntentId = intentFromUrl || sessionStorage.getItem('paymentIntentId');
    const paymentStatus = urlParams.get('redirect_status');

    const clearStoredIntent = () => {
      sessionStorage.removeItem('paymentIntentId');
    };

    const finalize = (nextStatus, nextMessage) => {
      if (!isMounted) {
        return;
      }
      setStatus(nextStatus);
      setMessage(nextMessage);
      clearStoredIntent();
    };

    if (paymentStatus === 'succeeded') {
      finalize('success', 'Payment successful! Your reservation has been confirmed.');
      return () => {
        isMounted = false;
      };
    }

    if (paymentStatus === 'failed') {
      finalize('failed', 'Payment failed. Please try again.');
      return () => {
        isMounted = false;
      };
    }

    if (!paymentIntentId) {
      finalize('failed', 'No payment information found.');
      return () => {
        isMounted = false;
      };
    }

    setStatus('processing');
    setMessage('Verifying your payment. This may take a moment...');

    const pollStatus = async () => {
      attempts += 1;
      try {
        const response = await agent.Payments.checkPaymentStatus(paymentIntentId);
        if (!isMounted) {
          return;
        }

        const backendStatus = response?.status;
        const backendReservationId = response?.reservationId;

        if (backendStatus === 'succeeded') {
          if (backendReservationId) {
            setReservationId(backendReservationId);
            setCountdown(5); // Start countdown for auto-redirect
          }
          finalize('success', 'Payment successful! Your reservation has been confirmed.');
          return;
        }

        if (backendStatus === 'failed') {
          finalize('failed', 'Payment failed or was cancelled. Please try again.');
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          finalize('failed', 'We could not confirm your payment. Please contact support if you were charged.');
          return;
        }

        pollTimerRef.current = setTimeout(pollStatus, POLL_INTERVAL);
      } catch (error) {
        finalize('failed', error.message || 'Unable to verify payment status. Please try again.');
      }
    };

    pollStatus();

    return () => {
      isMounted = false;
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [location.search]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewReservations = () => {
    if (reservationId) {
      navigate(`/portal/reservations/details/${reservationId}`);
    } else {
      navigate('/portal/reservations');
    }
  };

  // Auto-redirect to reservation details when successful (with a short countdown)
  useEffect(() => {
    let intervalId = null;
    if (status === 'success' && reservationId && countdown === null && autoRedirectEnabled) {
      setCountdown(5);
    }

    if (countdown !== null) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(intervalId);
            navigate(`/portal/reservations/details/${reservationId}`);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, reservationId, countdown, autoRedirectEnabled, navigate]);

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
            {reservationId && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Reservation ID: <strong>{reservationId}</strong>
                </Typography>
                {countdown !== null && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Redirecting to your reservation in {countdown}s...
                  </Typography>
                )}
              </>
            )}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="contained" onClick={handleViewReservations}>
                {reservationId ? 'View Reservation' : 'View My Reservations'}
              </Button>
              {countdown !== null && (
                <Button
                  variant="text"
                  onClick={() => {
                    setAutoRedirectEnabled(false);
                    setCountdown(null);
                  }}
                >
                  Stay on this page
                </Button>
              )}
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