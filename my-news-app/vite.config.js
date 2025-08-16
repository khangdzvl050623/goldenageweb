import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Thiết lập proxy để tránh lỗi CORS khi gọi API
    proxy: {
      '/api': {
        target: 'https://goldenages.online',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Giữ nguyên đường dẫn API
      },
    },
  },
})
