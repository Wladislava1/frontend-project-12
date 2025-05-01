import axios from 'axios';

const userData = {
  username: 'newuser',
  password: '123456',
};

axios.post('http://localhost:5002/api/v1/signup', userData)
  .then((response) => {
    console.log('Пользователь создан:', response.data);
  })
  .catch((error) => {
    console.error('Ошибка при создании пользователя:', error);
  });
