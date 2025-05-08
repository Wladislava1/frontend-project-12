import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useRollbar } from '@rollbar/react'
import { setCredentials } from './slices/AuthSlice.js'
import ChatPage from './components/ChatPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import NotFoundPage from './components/NotFoundPage.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import SignupPage from './components/SignupPage.jsx'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const dispatch = useDispatch()
  const rollbar = useRollbar()

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
  )
}

export default App
