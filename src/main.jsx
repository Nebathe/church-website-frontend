// src/main.jsx - This is CORRECT and should be the ONLY Router
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ This is the single Router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);