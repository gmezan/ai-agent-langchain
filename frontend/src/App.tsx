import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { User } from './models/user'
import { useChat } from './hooks/useChat'
import { assertEnv } from './config/env'
import { ChatNavbar } from './components/ChatNavbar'
import { ChatCard } from './components/ChatCard'

function App() {
  assertEnv()
  const { messages, input, sending, setInput, sendMessage, messagesEndRef } = useChat()
  const [user, setUser] = React.useState<User | null>(null)

  const handleSuccess = (userData: User) => { setUser(userData) }
  const handleLogout = () => setUser(null)

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <ChatNavbar user={user} onLogin={handleSuccess} onLogout={handleLogout} />

      {/* Main chat area: centered horizontally, fills remaining viewport height with padding */}
      <div className="flex-grow-1 d-flex justify-content-center p-3">
        <ChatCard
          messages={messages}
          input={input}
          sending={sending}
          onInputChange={setInput}
          onSend={() => { void sendMessage() }}
          messagesEndRef={messagesEndRef}
        />
      </div>

      <footer className="py-3 text-center small text-muted mt-auto">&copy; {new Date().getFullYear()} DogChatAgent</footer>
    </div>
  )
}

export default App
