import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import App from './App.jsx'
import store from './slices/index'
import initializeApp from './initApp.js'
import RollbarContext from './context/RollbarContext.js'

const root = document.getElementById('root')

initializeApp()
  .then(({ rollbar }) => {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ReduxProvider store={store}>
          <RollbarContext.Provider value={rollbar}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RollbarContext.Provider>
        </ReduxProvider>
      </React.StrictMode>,
    )
  })
  .catch((error) => {
    console.error('Ошибка инициализации приложения:', error)
  })
