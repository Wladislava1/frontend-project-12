import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useRollbar } from '@rollbar/react'
import { setCredentials, selectCurrentUser } from '../slices/AuthSlice'
import useAuth from '../useAuth'
import Navbar from './NavBar.jsx'

const SignupPage = () => {
  const [serverError, setServerError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const { t } = useTranslation()
  const rollbar = useRollbar()
  const { handleLogout } = useAuth()

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, `${t('modals.errors.min')}`)
      .max(20, `${t('modals.errors.max')}`)
      .required(`${t('modals.errors.required')}`),
    password: Yup.string()
      .min(6, `${t('modals.errors.password.min')}`)
      .required(`${t('modals.errors.required')}`),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], `${t('signup.confirmPassword.oneOf')}`)
      .required(`${t('modals.errors.required')}`),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError('')
    try {
      const response = await axios.post('/api/v1/signup', {
        username: values.username.trim(),
        password: values.password,
      })
      const { token, username } = response.data
      const user = { username }
      dispatch(setCredentials({ user, token }))
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/', { replace: true })
    }
    catch (error) {
      rollbar.error('Signup error', error)
      if (error.response?.status === 409) {
        setServerError(`${t('signup.userExists')}`)
      }
      else {
        setServerError(`${t('signup.serverError')}`)
      }
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} t={t} />
      <div className="d-flex flex-column justify-content-center align-items-center mt-5">
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="col-12 col-md-6 mt-3 mt-md-0">
              <h1 className="text-center mb-4">
                {t('signup.title')}
              </h1>

              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

              <div className="form-floating mb-3">
                <Field
                  name="username"
                  id="username"
                  type="text"
                  className="form-control"
                  placeholder={t('signup.username')}
                  autoComplete="username"
                  required
                />
                <label htmlFor="username">
                  {t('signup.username')}
                </label>
                <ErrorMessage name="username" component="div" className="invalid-feedback d-block" />
              </div>

              <div className="form-floating mb-3">
                <Field
                  name="password"
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder={t('signup.password')}
                  autoComplete="new-password"
                  required
                />
                <label htmlFor="password">
                  {t('signup.password')}
                </label>
                <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
              </div>

              <div className="form-floating mb-4">
                <Field
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  placeholder={t('signup.confirmPassword')}
                  autoComplete="new-password"
                  required
                />
                <label htmlFor="confirmPassword">
                  {t('signup.confirmPassword.confirm')}
                </label>
                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback d-block" />
              </div>

              <button
                type="submit"
                className="w-100 mb-3 btn btn-outline-primary"
                disabled={isSubmitting}
              >
                {t('signup.submit')}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default SignupPage
