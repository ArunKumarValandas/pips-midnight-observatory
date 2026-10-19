import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { apiPlugin } from './server/apiPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
})
