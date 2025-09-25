import React from 'react'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ReactMarkdown from 'react-markdown'
import type { Message } from '../models/message'

export interface ChatCardProps {
  messages: Message[]
  input: string
  sending: boolean
  onInputChange(value: string): void
  onSend(): void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onClear?: () => void
}

export const ChatCard: React.FC<ChatCardProps> = ({
  messages,
  input,
  sending,
  onInputChange,
  onSend,
  messagesEndRef,
  onClear,
}) => {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => { e.preventDefault(); onSend() }

  const bubbleVariant = (isUser: boolean, hasError: boolean) => {
    if (isUser) return 'bg-primary text-white'
    if (hasError) return 'bg-danger text-white'
    return 'bg-body-tertiary border'
  }

  return (
    <Card className="d-flex flex-column shadow-sm w-100" style={{ maxWidth: '1200px', minHeight: '0' }}>
      <Card.Header className="border-bottom py-2 d-flex align-items-center justify-content-between gap-2">
        <div className="small text-muted m-0">Conversation</div>
        <div className="d-flex align-items-center gap-2">
          {onClear && (
            <Button variant="outline-secondary" size="sm" onClick={onClear} disabled={messages.length === 0}>Clear</Button>
          )}
        </div>
      </Card.Header>
      <Card.Body className="d-flex flex-column overflow-hidden">
        <div className="flex-grow-1 overflow-auto pe-2" style={{ scrollBehavior: 'smooth' }}>
          {messages.length === 0 && (
            <div className="text-center text-muted mt-5">Start the conversation! Ask me anything about dogs 🐕</div>
          )}
          {messages.map((msg: Message, idx: number) => {
            const isUser = msg.role === 'user'
            const hasError = Boolean('error' in msg && msg.error)
            return (
              <div key={idx} className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
                <div
                  className={`px-3 py-2 rounded-4 shadow-sm ${bubbleVariant(isUser, hasError)}`}
                  style={{ maxWidth: '70%', fontSize: '.95rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                  {hasError && 'error' in msg && msg.error && (
                    <div className="mt-1 small opacity-75">{msg.error.message}</div>
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
                onChange={(e) => onInputChange(e.target.value)}
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
  )
}
