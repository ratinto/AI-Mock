import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ServicesProvider } from './app/ServicesProvider.tsx'
import { ToastProvider } from './app/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ServicesProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ServicesProvider>
  </StrictMode>,
)
