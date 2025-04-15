import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../slices/AuthSlice.js';

export const LoginPage = () => {
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (user, token) => {
        console.log('handleLogin: user, token', user, token);
        dispatch(setCredentials({ user, token }));
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/', { replace: true });
    };
    
    return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={ async (values, { setSubmitting }) => {
            const trimmedValues = {
                username: values.username.trim(),
                password: values.password.trim(),
            };
          console.log('onSubmit', trimmedValues);
          setError(false)
          try {
            const response = await axios.post('/api/v1/login', trimmedValues);
            console.log(response.data);
            const { token, username } = response.data;
            const user = { username };
            handleLogin(user, token);
          } catch (error) {
            console.error(error);
            setError(true);
          } finally {
            setSubmitting(false);
          }
        }}
    >
        {({ isSubmitting }) => (
          <Form className="col-12 col-md-6 mt-3 mt-md-0">
            <h1 className="text-center mb-4">Войти</h1>

            <div className="form-floating mb-3">
              <Field
                name="username"
                id="username"
                type="text"
                className="form-control"
                placeholder="Ваш ник"
                autoComplete="username"
                required
              />
              <label htmlFor="username">Ваш ник</label>
            </div>

            <div className="form-floating mb-4">
              <Field
                name="password"
                id="password"
                type="password"
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder="Пароль"
                autoComplete="current-password"
                required
              />
              <label htmlFor="password">Пароль</label>
              {error && (
                <div className="invalid-feedback d-block">
                  The username or password is incorrect
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-100 mb-3 btn btn-outline-primary"
              disabled={isSubmitting}
            >
              Войти
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
