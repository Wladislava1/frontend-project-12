import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentToken } from '../slices/AuthSlice.js';

const PrivateRoute = () => {
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  if (!token || token === 'null') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;