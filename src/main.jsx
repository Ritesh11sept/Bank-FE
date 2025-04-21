import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store.js';
import { TranslationProvider } from './context/TranslationContext';
import { TranslationProvider2 } from './context/TranslationContext2';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <TranslationProvider>
        <TranslationProvider2>
          {/* The BrowserRouter should only appear once in the app */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TranslationProvider2>
      </TranslationProvider>
    </Provider>
  </React.StrictMode>
);
