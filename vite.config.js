import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Remove the base setting if you're deploying to Netlify root
  // base: '/', // Only needed if deploying to a subdirectory
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})