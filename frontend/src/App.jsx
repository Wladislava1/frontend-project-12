import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { setCredentials } from './slices/AuthSlice'
import { routes } from './api/routes.js'
import ChatPage from './components/ChatPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import SignupPage from './components/SignupPage.jsx'
import 'react-toastify/dist/ReactToastify.css'
import RollbarContext from './context/RollbarContext.js'

const App = () => {
  const dispatch = useDispatch()
  const rollbar = useContext(RollbarContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')
    try {
      const user = JSON.parse(userRaw)
      if (token && token !== 'null' && user && typeof user === 'object' && user.username) {
        dispatch(setCredentials({ token, user }))
      }
      else {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    catch (e) {
      rollbar.error('Error parsing user from localStorage', e)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }, [dispatch])

  return (
    <>
      <Routes>
        <Route path={routes.loginPage()} element={<LoginPage />} />
        <Route path={routes.signupPage()} element={<SignupPage />} />
        <Route element={<PrivateRoute />}>
          <Route path={routes.homePage()} element={<ChatPage />} />
        </Route>
        <Route path={routes.notfoundPage()} element={<NotFoundPage />} />
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
  )
}

export default App
