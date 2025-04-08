import { ConfigProvider } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import '../src/assets/css/index.css';
import App from './App.jsx';
import { ErrorBoundary } from './error-boundry.jsx';
import { store } from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
          },
        }}
      >
        <ErrorBoundary fallback={<h1>Error</h1>}>
          <App />
          <ToastContainer position="top-center" />
        </ErrorBoundary>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
