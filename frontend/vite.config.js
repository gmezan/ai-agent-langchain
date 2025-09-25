import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ai-agent-langchain/',
  server: {
    headers: {
      // Fully disable opener isolation during dev (most permissive)
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      // Disable cross-origin isolation during dev to prevent COEP blocks
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      // Disable Origin-Agent-Cluster isolation that can also affect postMessage behavior
      'Origin-Agent-Cluster': '?0'
    }
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'unsafe-none',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      'Origin-Agent-Cluster': '?0'
    }
  }
})
