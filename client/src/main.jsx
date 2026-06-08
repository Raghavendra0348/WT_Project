import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.css';
import './styles/premium.css';
import './styles/dashboard.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
