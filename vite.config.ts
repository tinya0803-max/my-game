import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindvite from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindvite()],
  server: {
    port: 3000,
    open: true
  }
})
