import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    fastRefresh: true,
  })],
  server: {
    port: 5174,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
