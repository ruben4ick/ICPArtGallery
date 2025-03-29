import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { AuthProvider } from './context/@wallet-login/AuthContext';
import { NftProvider } from './context/@nfts/NftProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <NftProvider>
      <App />
      </NftProvider>
    </AuthProvider>
  </React.StrictMode>
);
