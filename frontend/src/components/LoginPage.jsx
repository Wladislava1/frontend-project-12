import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../slices/AuthSlice.js';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/AuthSlice.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import useAuth from '../useAuth.js';
import Navbar from './NavBar.jsx';

export const LoginPage = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const { handleLogout } = useAuth();


  const handleLogin = (user, token) => {
    dispatch(setCredentials({ user, token }));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/', { replace: true });
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} t={t} />
      <div className="d-flex flex-column vh-100">
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={ async (values, { setSubmitting }) => {
                const trimmedValues = {
                    username: values.username.trim(),
                    password: values.password.trim(),
                };
              setError(false)
              try {
                const response = await axios.post('/api/v1/login', trimmedValues);
                console.log(response.data);
                const { token, username } = response.data;
                const user = { username };
                handleLogin(user, token);
              } catch (error) {
                if (!error.response) {
                  toast.error(t('network.error'));
                  rollbar.error('Network error during login', error);
                } else {
                  setError(true);
                  rollbar.error('Login failed', error);
                }
              } finally {
                setSubmitting(false);
              }
            }}
        >
            {({ isSubmitting }) => (
              <Form className="col-12 col-md-6 mt-3 mt-md-0">
                <h1 className="text-center mb-4">{t('login.title')}</h1>

                <div className="form-floating mb-3">
                  <Field
                    name="username"
                    id="username"
                    type="text"
                    className="form-control"
                    placeholder={t('login.username')}
                    autoComplete="username"
                    required
                  />
                  <label htmlFor="username">{t('login.username')}</label>
                </div>

                <div className="form-floating mb-4">
                  <Field
                    name="password"
                    id="password"
                    type="password"
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    placeholder={t('login.password')}
                    autoComplete="current-password"
                    required
                  />
                  <label htmlFor="password">{t('login.password')}</label>
                  {error && (
                    <div className="invalid-feedback d-block">
                      {t('login.error')}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-100 mb-3 btn btn-outline-primary"
                  disabled={isSubmitting}
                >
                  {t('login.submit')}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="card-footer p-4">
          <div className="text-center">
            <span>{t('login.noAccount')} </span>
            <Link to="/signup">{t('login.signup')}</Link>
          </div>
        </div>
      </div>
    </>
  );
};
