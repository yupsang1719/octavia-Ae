import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Raise warning threshold — our lazy-loaded routes are already split
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-helmet-async/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'motion'
          }
          if (id.includes('node_modules/react-hook-form/') || id.includes('node_modules/zod/') || id.includes('node_modules/@hookform/') || id.includes('node_modules/axios/')) {
            return 'forms'
          }
          if (id.includes('node_modules/react-markdown/') || id.includes('node_modules/remark') || id.includes('node_modules/unified') || id.includes('node_modules/hast') || id.includes('node_modules/mdast') || id.includes('node_modules/micromark')) {
            return 'markdown'
          }
        },
      },
    },
  },
})
