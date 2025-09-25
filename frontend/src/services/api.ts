import type { AssistantMessage } from '../models/message'

const API_URL = 'http://127.0.0.1:8000'

export const chatService = {
  async sendMessage(content: string, threadId: string | null): Promise<AssistantMessage> {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, thread_id: threadId }),
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          role: 'assistant',
          content: data.message || 'An error occurred',
          error: {
            message: data.message || 'An error occurred',
            code: response.status,
          },
        }
      }

      return {
        role: 'assistant',
        content: data.content as string,
        thread_id: data.thread_id as string,
        error: null,
      }
    } catch (error) {
      const err = error as { message?: string }
      return {
        role: 'assistant',
        content: 'A network error occurred',
        error: {
          message: err?.message || 'A network error occurred',
          code: 'NETWORK_ERROR',
        },
      }
    }
  },
}
