import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/os_rs_maxing_calc/', // Use the repository name for GitHub Pages
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: ``
      }
    }
  }
})