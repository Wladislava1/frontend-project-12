import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken } from '../slices/AuthSlice.js';

const PrivateRoute = () => {
  const token = useSelector(selectCurrentToken);
  console.log('PrivateRoute: token from Redux:', token);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token === null) return;
    if (!token) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [token, navigate, location]);

  if (token === null) {
    return <div>Загрузка...</div>;
  }

  return <Outlet />;
};

export default PrivateRoute;