import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx'
import './index.css'

// Add Material Icons Round font
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons+Round';
link.rel = 'stylesheet';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)