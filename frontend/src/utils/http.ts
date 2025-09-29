export class HttpError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message)
    this.name = 'HttpError'
  }
}

// Store for Azure auth token
let azureAuthToken: string | null = null

export function setAzureAuthToken(token: string | null) {
  azureAuthToken = token
}

export function getAzureAuthToken(): string | null {
  return azureAuthToken
}

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  
  // Add Azure auth token if available and not already set
  if (azureAuthToken && !headers.has('X-ZUMO-AUTH')) {
    headers.set('X-ZUMO-AUTH', azureAuthToken)
  }
  
  const res = await fetch(input, {
    ...init,
    headers,
  })
  
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  
  if (!res.ok) {
    let message = res.statusText || 'Request failed'
    if (isJson && typeof data === 'object' && data !== null && 'message' in data) {
      const maybeMsg = (data as Record<string, unknown>).message
      if (typeof maybeMsg === 'string') message = maybeMsg
    }
    throw new HttpError(res.status, message, data)
  }
  return data as T
}