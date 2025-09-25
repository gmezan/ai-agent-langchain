import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactMarkdown from 'react-markdown'
import { LoginButton } from './login/google.tsx'
import type { Message } from './models/message.ts'
import type { User } from './models/user.ts'
import { useChat } from './hooks/useChat'
import { assertEnv } from './config/env'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

function App() {
  assertEnv()
  const { messages, input, sending, setInput, sendMessage, messagesEndRef } = useChat()
  const [user, setUser] = React.useState<User | null>(null)

  const handleSuccess = (userData: User) => { setUser(userData) }
  const handleLogout = () => setUser(null)
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => { e.preventDefault(); void sendMessage() }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="white" className="shadow-sm" expand="md" sticky="top">
        <Container fluid="lg">
          <Navbar.Brand className="fw-semibold d-flex align-items-center gap-2">
            <span role="img" aria-label="dog">🐶</span>
            Dog<span className="text-primary">Chat</span>Agent
          </Navbar.Brand>
          <div className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-circle border"
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <span className="fw-medium small d-none d-sm-inline">{user.name}</span>
                <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Sign out</Button>
              </>
            ) : (
              <LoginButton onLogin={handleSuccess} />
            )}
          </div>
        </Container>
      </Navbar>

      {/* Main chat area: centered horizontally, fills remaining viewport height with padding */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-stretch p-3">
        <Card
          className="shadow-sm w-100 d-flex flex-column"
          style={{
            maxWidth: '1200px',
            // Fill vertical space minus navbar & footer via flex parent; ensure a minimum usable height
            minHeight: '0'
          }}
        >
          <Card.Header className="bg-white border-bottom py-2">
            <div className="small text-muted">Conversation</div>
          </Card.Header>
          <Card.Body className="d-flex flex-column overflow-hidden p-3">
            <div className="flex-grow-1 overflow-auto pe-2" style={{ scrollBehavior: 'smooth' }}>
              {messages.length === 0 && (
                <div className="text-center text-muted mt-5">Start the conversation! Ask me anything about dogs 🐕</div>
              )}
              {messages.map((msg: Message, idx: number) => {
                const isUser = msg.role === 'user'
                const hasError = 'error' in msg && msg.error
                return (
                  <div key={idx} className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`px-3 py-2 rounded-4 shadow-sm ${isUser ? 'bg-primary text-white' : hasError ? 'bg-danger text-white' : 'bg-white border'}`}
                      style={{ maxWidth: '70%', fontSize: '.95rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                    >
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                      {hasError && (
                        <div className="mt-1 small opacity-75">{msg.error?.message}</div>
                      )}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
            <Form onSubmit={onSubmit} className="pt-2">
              <Row className="g-2 align-items-end">
                <Col xs={12} md={9} lg={10}>
                  <Form.Control
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    autoFocus
                    aria-label="Message input"
                  />
                </Col>
                <Col xs={12} md={3} lg={2} className="d-grid">
                  <Button type="submit" disabled={sending} variant="primary">
                    {sending ? 'Sending…' : 'Send'}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <footer className="py-3 text-center small text-muted mt-auto">&copy; {new Date().getFullYear()} DogChatAgent</footer>
    </div>
  )
}

export default App
