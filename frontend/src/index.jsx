import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import App from './App.jsx'
import store from './slices/index'
import { initI18n } from './i18n'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENVIRONMENT,
}

const root = document.getElementById('root')

initI18n()
  .then(() => {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ReduxProvider store={store}>
          <RollbarProvider config={rollbarConfig}>
            <ErrorBoundary>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ErrorBoundary>
          </RollbarProvider>
        </ReduxProvider>
      </React.StrictMode>,
    )
  })
  .catch(error => {
    console.error('Ошибка инициализации i18n:', error)
  })
