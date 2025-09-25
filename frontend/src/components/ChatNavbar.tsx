import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { LoginButton } from '../login/google'
import type { User } from '../models/user'

export interface ChatNavbarProps {
  user: User | null
  onLogin(user: User): void
  onLogout(): void
}

export const ChatNavbar: React.FC<ChatNavbarProps> = ({ user, onLogin, onLogout }) => {
  return (
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
              <span className="fw-semibold small d-none d-sm-inline">{user.name}</span>
              <Button variant="outline-secondary" size="sm" onClick={onLogout}>Sign out</Button>
            </>
          ) : (
            <LoginButton onLogin={onLogin} />
          )}
        </div>
      </Container>
    </Navbar>
  )
}
