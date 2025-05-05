import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from 'react-redux';
import App from './App.jsx'
import store from './slices/index.js';
import './i18n';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';

const rollbarConfig = {
  accessToken: 'fe02a2add61548e3bac3066cafe7a0924ea8351f03b889e4c8335341089667c6a1825abadc81d6578577d0a5dd53fc50',
  environment: 'production',
};
const root = document.getElementById("root");

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
  </React.StrictMode>
);