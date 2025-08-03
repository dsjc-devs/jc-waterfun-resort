import { Alert, Snackbar, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const SnackBar = ({ open, onClose, message, anchorOrigin, alert, duration }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={handleClose}
        severity={alert.color}
        variant="filled"
        sx={{ width: '100%', color: '#fff' }}
      >
        <Typography>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

SnackBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
  }).isRequired,
  alert: PropTypes.shape({
    color: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
  }).isRequired,
};

export default SnackBar;
