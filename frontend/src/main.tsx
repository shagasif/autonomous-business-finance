import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

const isDashboardRoute = window.location.pathname.startsWith('/dashboard')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      {isDashboardRoute ? <App /> : <LandingPage />}
    </ThemeProvider>
  </StrictMode>,
)
