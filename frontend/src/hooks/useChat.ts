import { useEffect, useRef, useState } from 'react'
import type { AssistantMessage, Message, UserMessage } from '../models/message'
import { chatService } from '../services/api'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    const userMsg: UserMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    const response = await chatService.sendMessage(userMsg.content, threadId)
    if (!response.error && response.thread_id) setThreadId(response.thread_id)
    setMessages((prev) => [...prev, response as AssistantMessage])
    setSending(false)
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
  }
}