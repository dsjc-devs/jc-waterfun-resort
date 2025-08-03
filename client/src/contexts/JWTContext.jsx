import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'utils/axios';
import { LOGIN, LOGOUT } from './auth-reducer/actions';
import authReducer from './auth-reducer/auth';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  isLoggedIn: false,
  user: null,
  isInitialized: false,
};

const JWTContext = createContext(initialState);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setSession = (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common.Authorization;
    }
  };

  const verifyToken = (token) => {
    if (!token) return false;
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/v1/users/login', { emailAddress: email, password });
      const { token, user } = response.data;
      setSession(token);
      dispatch({ type: LOGIN, payload: { isLoggedIn: true, user } });
    } catch (error) {
      throw new Error(error?.response?.data?.message);
    }
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && verifyToken(token)) {
      const decodedUser = jwtDecode(token);
      dispatch({ type: LOGIN, payload: { isLoggedIn: true, user: decodedUser } });
      setSession(token)
    } else {
      dispatch({ type: LOGOUT });
    }
  }, []);

  return (
    <JWTContext.Provider value={{ ...state, login, logout }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;
