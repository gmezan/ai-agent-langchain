export class HttpError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message)
    this.name = 'HttpError'
  }
}

export async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    const message = (isJson && (data as any)?.message) || res.statusText || 'Request failed'
    throw new HttpError(res.status, message, data)
  }
  return data as T
}