import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './slices/AuthSlice.js';
import { Routes, Route } from 'react-router-dom';
import { ChatPage } from './components/ChatPage.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { NotFoundPage } from './components/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { SignupPage } from './components/SignupPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(setCredentials({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
