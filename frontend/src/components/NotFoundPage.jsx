import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../slices/AuthSlice'
import Navbar from './NavBar.jsx'
import useAuth from '../useAuth'
import iSvg from '../assets/i.svg'

const NotFoundPage = () => {
  const { t } = useTranslation()
  const user = useSelector(selectCurrentUser)
  const { handleLogout } = useAuth()

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
          <a href="/">
            {t('notFound.descriptionLink1')}
          </a>
        </p>
      </div>
    </>
  )
}

export default NotFoundPage
