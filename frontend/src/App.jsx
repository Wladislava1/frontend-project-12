import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from './slices/AuthSlice.js';
import { Routes, Route } from 'react-router-dom';
import { ChatPage } from './components/ChatPage.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { NotFoundPage } from './components/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(setCredentials({ token, user: JSON.parse(user) }));
    }
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ChatPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default App;
