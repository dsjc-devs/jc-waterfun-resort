import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import EmptyUserCard from 'components/cards/skeleton/EmptyUserCard';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Simulate loading while checking token
    const timeout = setTimeout(() => {
      if (!token) {
        navigate('/login', {
          state: { from: location.pathname },
          replace: true,
        });
      } else {
        setCheckingAuth(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [navigate, location]);

  if (checkingAuth) {
    return (
      <EmptyUserCard title='Loading...' />
    );
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
