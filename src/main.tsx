import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ServicesProvider } from './app/ServicesProvider.tsx'
import { ToastProvider } from './app/ToastProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ServicesProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ServicesProvider>
    </BrowserRouter>
  </StrictMode>,
)
