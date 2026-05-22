import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',  // Use IP específico
    strictPort: true
    // SEM watch, SEM hmr complexo, SEM host: true
  }
})