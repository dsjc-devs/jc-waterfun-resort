import React, { createContext, useContext, useState } from 'react';
import SnackBar from '../components/@extended/SnackBar';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    alert: { color: 'success' },
    duration: 3000,
  });

  const openSnackbar = ({ message, anchorOrigin = { vertical: 'top', horizontal: 'right' }, alert = { color: 'success' }, duration = 3000 }) => {
    setSnackbar({
      open: true,
      message,
      anchorOrigin,
      alert,
      duration,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      <SnackBar
        open={snackbar.open}
        onClose={closeSnackbar}
        message={snackbar.message}
        anchorOrigin={snackbar.anchorOrigin}
        alert={snackbar.alert}
        duration={snackbar.duration}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
