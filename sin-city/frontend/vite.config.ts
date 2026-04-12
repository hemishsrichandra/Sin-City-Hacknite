import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to the network so other devices can connect
    port: 5173,
    fs: {
      allow: [
        '..',
        '/Users/hemish/.gemini/antigravity/brain',
        '/Users/adarshsingh/.gemini/antigravity/brain'
      ]
    }
  }
})
