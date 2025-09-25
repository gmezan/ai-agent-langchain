export type UserMessage = {
  role: 'user'
  content: string
}

export type AssistantError = {
  message: string
  code: number | string
}

export type AssistantMessage = {
  role: 'assistant'
  content: string
  thread_id?: string
  error: null | AssistantError
}

export type Message = UserMessage | AssistantMessage
