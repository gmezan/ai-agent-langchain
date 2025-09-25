export const env = {
  API_URL: (import.meta as any).env?.VITE_API_URL ?? 'http://127.0.0.1:8000',
  GOOGLE_CLIENT_ID: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID as string | undefined,
} as const

export function assertEnv() {
  if (!env.GOOGLE_CLIENT_ID) {
    console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google login will not work.')
  }
}