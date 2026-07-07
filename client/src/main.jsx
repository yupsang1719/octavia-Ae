import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { PracticeProvider } from './contexts/PracticeContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <PracticeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PracticeProvider>
    </HelmetProvider>
  </StrictMode>,
)
