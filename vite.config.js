import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // --- PROXY CONFIGURATION START ---
  server: {
    proxy: {
      // Forward all requests starting with '/api' to your Express server
      '/api': 'http://localhost:5000',
    },
  },
  // --- PROXY CONFIGURATION END ---
})