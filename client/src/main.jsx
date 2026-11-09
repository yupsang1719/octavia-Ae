import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { PracticeProvider } from './contexts/PracticeContext'
import './index.css'
import App from './App.jsx'

// The server stamps per-practice title/description/canonical into the HTML for
// crawlers that don't run JS. Helmet renders each page's own, so drop these
// first or every page would carry two conflicting sets.
document.querySelectorAll('head [data-ssr]').forEach(el => el.remove())

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
