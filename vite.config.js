import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, forward /api/* to the Express server so there are no CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:4000' } },
  preview: { proxy: { '/api': 'http://localhost:4000' } },
})
