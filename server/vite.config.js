// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Địa chỉ backend của bạn
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Loại bỏ phần /api nếu cần thiết
      },
    },
  },
});
