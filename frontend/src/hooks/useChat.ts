import { useEffect, useRef, useState } from 'react'
import type { AssistantMessage, Message, UserMessage } from '../models/message'
import { chatService } from '../services/api'

export function useChat() {
  const STORAGE_KEY = 'chat.messages.v1'

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Message[]
      if (Array.isArray(parsed)) return parsed
      return []
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // ignore quota / serialization issues
    }
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    const userMsg: UserMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    // Add a transient thinking placeholder
    const thinkingId = `thinking-${Date.now()}`
      const thinkingMsg: AssistantMessage = { role: 'assistant', content: 'Thinking…', thread_id: threadId ?? undefined, error: null }
      setMessages((prev) => [...prev, thinkingMsg])
    try {
      const response = await chatService.sendMessage(userMsg.content, threadId)
      if (!response.error && response.thread_id) setThreadId(response.thread_id)
        setMessages((prev) => {
          const copy = [...prev]
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant' && copy[i].content === 'Thinking…') { copy[i] = response as AssistantMessage; break }
          }
          return copy
        })
    } catch (err) {
        const errorMsg: AssistantMessage = {
          role: 'assistant',
          content: 'An unexpected error occurred.',
          thread_id: threadId ?? undefined,
          error: { message: err instanceof Error ? err.message : 'Unknown error', code: 'GENERIC_ERROR' }
        }
        // Replace the thinking placeholder (last assistant message assumed to be the placeholder)
        setMessages((prev) => {
          const copy = [...prev]
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant' && copy[i].content === 'Thinking…') { copy[i] = errorMsg; break }
          }
          return copy
        })
    } finally {
      setSending(false)
    }
  }

  function clearMessages() {
    setMessages([])
    setThreadId(null)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return {
    // state
    messages,
    input,
    threadId,
    sending,
    messagesEndRef,
    // actions
    setInput,
    sendMessage,
    clearMessages,
  }
}