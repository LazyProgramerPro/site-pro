import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './assets/css/index.css'; // Fixed import path
import { ErrorBoundary } from './error-boundry.jsx';
import { store } from './redux/store.js';
import { restoreAuthSession, setupAuthSync } from './services/authService.js';

// Khôi phục phiên đăng nhập từ localStorage nếu có
restoreAuthSession();

// Khởi tạo cơ chế đồng bộ auth state giữa các tab
setupAuthSync();

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
        </ErrorBoundary>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
