import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ServicesProvider } from './app/ServicesProvider.tsx'
import { ToastProvider } from './app/ToastProvider.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ServicesProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ServicesProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
