import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/auth.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Ensure env type narrowing; Vite injects string | undefined
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

if (!clientId) {
  console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google login will not work.')
}

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId ?? ''}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
