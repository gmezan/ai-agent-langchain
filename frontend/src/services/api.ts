import type { AssistantMessage } from '../models/message'
import { env } from '../config/env'
import { http, HttpError } from '../utils/http'

type ChatResponse = { content: string; thread_id: string }

export const chatService = {
  async sendMessage(content: string, threadId: string | null): Promise<AssistantMessage> {
    try {
      const data = await http<ChatResponse>(`${env.API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, thread_id: threadId }),
      })

      return {
        role: 'assistant',
        content: data.content,
        thread_id: data.thread_id,
        error: null,
      }
    } catch (error) {
      if (error instanceof HttpError) {
        return {
          role: 'assistant',
          content: error.message || 'An error occurred',
          error: { message: error.message, code: error.status },
        }
      }
      const err = error as { message?: string }
      return {
        role: 'assistant',
        content: 'A network error occurred',
        error: { message: err?.message || 'A network error occurred', code: 'NETWORK_ERROR' },
      }
    }
  },
}
