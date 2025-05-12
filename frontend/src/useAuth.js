import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, selectCurrentUser, selectCurrentToken } from './slices/AuthSlice'

const useAuth = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)

  const handleLogin = (user, token) => {
    dispatch(setCredentials({ user, token }))
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const handleLogout = () => {
    dispatch(setCredentials({ user: null, token: null }))
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { user, token, handleLogout, handleLogin }
}

export default useAuth
