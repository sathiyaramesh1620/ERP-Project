import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Marie-ERP/api': {
        target: 'https://app.gomarie.com',
        changeOrigin: true,
        secure: true, // You can set this to true if you need SSL
        // You may add other proxy options here if needed
      }
    }

  },
})