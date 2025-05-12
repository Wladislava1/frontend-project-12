import { useTranslation } from 'react-i18next'
import Navbar from './NavBar.jsx'
import useAuth from '../useAuth'
import iSvg from '../assets/i.svg'
import { routes } from '../api/routes.js'

const NotFoundPage = () => {
  const { t } = useTranslation()
  const { handleLogout, user } = useAuth()

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} t={t} />
      <div className="text-center">
        <img alt={t('notFound.alt')} src={iSvg} />
        <h1 className="h4 text-muted">
          {t('notFound.alt')}
        </h1>
        <p className="text-muted">
          {t('notFound.descriptionLink')}
          {' '}
          <a href={routes.homePage()}>
            {t('notFound.descriptionLink1')}
          </a>
        </p>
      </div>
    </>
  )
}

export default NotFoundPage
