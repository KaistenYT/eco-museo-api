import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/actors': {
        target: 'https://historias-api-crud.vercel.app',
        changeOrigin: true,
        secure: true
      },
      '/authors': {
        target: 'https://historias-api-crud.vercel.app',
        changeOrigin: true,
        secure: true
      },
      '/histories': {
        target: 'https://historias-api-crud.vercel.app',
        changeOrigin: true,
        secure: true
      }
    }
  },
  define: {
    'process.env': process.env
  }
})
