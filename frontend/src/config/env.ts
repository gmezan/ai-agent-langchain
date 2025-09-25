interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
  // add new env vars here as needed
}
interface ImportMeta { env: ImportMetaEnv }

const viteEnv: ImportMetaEnv = (import.meta as ImportMeta).env || {}

export const env = {
  API_URL: viteEnv.VITE_API_URL ?? 'http://127.0.0.1:8000',
  GOOGLE_CLIENT_ID: viteEnv.VITE_GOOGLE_CLIENT_ID,
} as const

export function assertEnv() {
  if (!env.GOOGLE_CLIENT_ID) {
    console.warn('VITE_GOOGLE_CLIENT_ID is not set. Google login will not work.')
  }
}