import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5454',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  css: {
    postcss: './postcss.config.js',
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ['react', 'react-dom', 'react-router-dom'],
          reduxVendor: ['redux', 'react-redux', 'redux-thunk'],
          muiVendor: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }

})
