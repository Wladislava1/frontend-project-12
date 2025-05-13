import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationRU from './language/ru/translation.json'

const resources = {
  ru: {
    translation: translationRU,
  },
}

export const initI18n = () =>
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })

export default i18n
