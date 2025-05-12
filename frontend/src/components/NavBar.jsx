import { Link, useNavigate } from 'react-router-dom'
import { routes } from '../api/routes.js'

const Navbar = ({ user, onLogout, t }) => {
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    onLogout()
    navigate(routes.loginPage(), { replace: true })
  }
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={user ? routes.homePage() : routes.loginPage()}>
          Hexlet Chat
        </Link>
        {user && (
          <button type="button" className="btn btn-primary" onClick={handleLogoutClick}>
            {t('navbar.logout')}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
