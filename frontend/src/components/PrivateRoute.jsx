import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../useAuth'

const PrivateRoute = () => {
  const location = useLocation()
  const { token } = useAuth()

  if (!token || token === 'null') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default PrivateRoute
