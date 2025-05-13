import { initI18n } from './i18n'
import Rollbar from 'rollbar'
import leoProfanity from 'leo-profanity'

const initializeApp = async () => {
  try {
    await initI18n()

    leoProfanity.loadDictionary('ru')
    leoProfanity.loadDictionary('en')

    const rollbar = new Rollbar({
      accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
      environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT,
    })

    return { rollbar }
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error)
    throw error
  }
}

export default initializeApp
