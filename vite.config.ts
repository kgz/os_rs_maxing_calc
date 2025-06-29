import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determine if we're building for production or beta
const isBeta = process.env.DEPLOY_ENV === 'beta'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Use root path for both domains
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: ``
      }
    }
  },
  define: {
    'import.meta.env.VITE_APP_ENV': JSON.stringify(isBeta ? 'beta' : 'production')
  }
})