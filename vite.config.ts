import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/avatar 로 시작하는 요청을 notion-avatar.app 으로 프록시
      '/api/avatar': {
        target: 'https://notion-avatar.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/avatar/, '/api/svg'), // 경로 재작성: /api/avatar -> /api/svg
      },
    },
  },
})
