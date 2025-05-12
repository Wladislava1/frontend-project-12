import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../useAuth'
import { routes } from '../api/routes'

const PrivateRoute = () => {
  const location = useLocation()
  const { token } = useAuth()

  if (!token || token === 'null') {
    return <Navigate to={routes.loginPage()} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default PrivateRoute
