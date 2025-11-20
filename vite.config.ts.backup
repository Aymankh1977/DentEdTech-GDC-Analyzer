import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      fastRefresh: true,
    }),
  ],
  server: {
    port: 5174,
    host: true,
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    // Skip type checking during build
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings during build
        if (warning.code === 'THIS_IS_UNDEFINED') return
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      }
    }
  },
  esbuild: {
    // Suppress TypeScript errors during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}))
