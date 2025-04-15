import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../slices/AuthSlice.js';

export const ChatPage = () => {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  console.log('Token:', token);
  console.log('User:', user);

  return (
    <div>
      <h1>Привет мир!</h1>
      <p>Текущий токен: {token ? token : 'Токен отсутствует'}</p>
      <p>Пользователь: {user ? user.username || JSON.stringify(user) : 'Пользователь не авторизован'}</p>
    </div>
  );
};