import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactMarkdown from 'react-markdown'
import { chatService } from './services/api.ts'
import { LoginButton } from './login/google.tsx'
import type { AssistantMessage, Message, UserMessage } from './models/message.ts'
import type { User } from './models/user.ts'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>('')
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const handleSuccess = (userData: User) => {
    console.log('Setting User Data:', userData)
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg: UserMessage = { role: 'user', content: input }
    setMessages((msgs) => [...msgs, userMsg])
    setInput('')
    const response = await chatService.sendMessage(input, threadId)
    if (!response.error) {
      setThreadId(response.thread_id ?? null)
    }
    setMessages((msgs) => [...msgs, response as AssistantMessage])
  }

  return (
    <div
      className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center"
      style={{ background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}
    >
      <div className="w-100" style={{ maxWidth: 900 }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{ letterSpacing: 2 }}>
            DogChatAgent
          </h1>
          <p className="text-muted">Your AI dog chat assistant</p>
          {user ? (
            <div>
              <h2>Welcome, {user.name}!</h2>
              <p>Email: {user.email}</p>
              <button onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <LoginButton onLogin={handleSuccess} />
          )}
        </div>
        <div
          className="chat-window border rounded shadow-sm mb-3 bg-white"
          style={{ height: '65vh', minHeight: '400px', overflowY: 'auto', padding: '2rem' }}
        >
          {messages.length === 0 && (
            <div className="text-center text-muted">Start the conversation!</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-3 rounded-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'error' in msg && msg.error
                    ? 'bg-danger text-white'
                    : 'bg-success text-white'
                }`}
                style={{ maxWidth: '60%', fontSize: '0.95rem' }}
              >
                <div>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                  {'error' in msg && msg.error && (
                    <div className="mt-2 small opacity-75">{msg.error.message}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="d-flex gap-2">
          <input
            className="form-control"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            autoFocus
            style={{ fontSize: '0.95rem' }}
          />
          <button className="btn btn-primary px-4" type="submit" style={{ fontSize: '0.95rem' }}>
            Send
          </button>
        </form>
      </div>
      <footer className="mt-auto text-center text-muted small" style={{ opacity: 0.7 }}>
        &copy; {new Date().getFullYear()} DogChatAgent
      </footer>
    </div>
  )
}

export default App
