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
        secure: true,
        rewrite: (path) => path.replace(/^\/actors/, '')
      },
      '/authors': {
        target: 'https://historias-api-crud.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/authors/, '')
      },
      '/histories': {
        target: 'https://historias-api-crud.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/histories/, '')
      }
    }
  },
  define: {
    'process.env': process.env
  }
})
