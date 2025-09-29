import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { User } from './models/user'
import { useChat } from './hooks/useChat'
import { assertEnv } from './config/env'
import { ChatNavbar } from './components/ChatNavbar'
import { ChatCard } from './components/ChatCard'
import { azureAuthService } from './services/azure-auth'

function App() {
  assertEnv()
  const { messages, input, sending, setInput, sendMessage, messagesEndRef, clearMessages } = useChat()
  const [user, setUser] = React.useState<User | null>(null)
  const [sessionRestored, setSessionRestored] = React.useState(false)

  // Restore session on app startup
  React.useEffect(() => {
    const restoreSession = async () => {
      console.log('🚀 App starting - checking for existing session...')
      const storedSession = azureAuthService.restoreSession()
      
      if (storedSession) {
        // Validate the session is still active
        const isValid = await azureAuthService.validateSession()
        if (isValid && storedSession.googleUser) {
          // Restore the complete Google user object
          setUser(storedSession.googleUser)
          console.log('🎉 Session successfully restored!')
        } else if (isValid) {
          // Fallback to minimal user if Google data is missing
          const minimalUser: User = {
            id: storedSession.user.userId,
            name: 'Authenticated User',
            email: '',
            picture: '',
          }
          setUser(minimalUser)
          console.log('🎉 Session restored (minimal user data)')
        }
      } else {
        console.log('🔍 No existing session found')
      }
      setSessionRestored(true)
    }
    
    restoreSession()
  }, [])

  const handleSuccess = (userData: User) => { 
    setUser(userData)
    // Clear chat history when user signs in (new session)
    clearMessages()
    console.log('🧹 Chat history cleared for new user session')
  }
  const handleLogout = async () => {
    try {
      // Logout from Azure Easy Auth
      await azureAuthService.logout()
    } catch (error) {
      console.warn('⚠️ Azure logout failed, but continuing with local logout:', error)
    }
    // Clear chat history when user signs out
    clearMessages()
    console.log('🧹 Chat history cleared on logout')
    setUser(null)
  }
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ui.theme')
      if (stored === 'light' || stored === 'dark') return stored
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    }
    return 'light'
  })
  React.useEffect(() => {
    try { localStorage.setItem('ui.theme', theme) } catch { /* ignore */ }
  }, [theme])
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  // Show loading state while checking for existing session
  if (!sessionRestored) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-body justify-content-center align-items-center" data-bs-theme={theme}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-body" data-bs-theme={theme}>
      <ChatNavbar user={user} onLogin={handleSuccess} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main chat area: centered horizontally, fills remaining viewport height with padding */}
  <div className="flex-grow-1 d-flex justify-content-center p-3">
        <ChatCard
          messages={messages}
          input={input}
          sending={sending}
          onInputChange={setInput}
          onSend={() => { void sendMessage() }}
          messagesEndRef={messagesEndRef}
          onClear={clearMessages}
        />
      </div>

      <footer className="py-3 text-center small text-muted mt-auto">&copy; {new Date().getFullYear()} DogChatAgent</footer>
    </div>
  )
}

export default App
