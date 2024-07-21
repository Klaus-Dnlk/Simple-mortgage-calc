import React from 'react';
import '@fontsource/roboto';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// const root = ReactDOM.createRoot(document.getElementById('root'))
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);
