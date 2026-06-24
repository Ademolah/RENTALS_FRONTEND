import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async' // 🚨 IMPORT THE PROVIDER
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> {/* 🟢 WRAP YOUR APP CORE */}
      <App />
    </HelmetProvider>
  </StrictMode>,
)

