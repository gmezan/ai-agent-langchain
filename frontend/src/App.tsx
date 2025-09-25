import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { User } from './models/user'
import { useChat } from './hooks/useChat'
import { assertEnv } from './config/env'
import { ChatNavbar } from './components/ChatNavbar'
import { ChatCard } from './components/ChatCard'

function App() {
  assertEnv()
  const { messages, input, sending, setInput, sendMessage, messagesEndRef, clearMessages } = useChat()
  const [user, setUser] = React.useState<User | null>(null)

  const handleSuccess = (userData: User) => { setUser(userData) }
  const handleLogout = () => setUser(null)
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
