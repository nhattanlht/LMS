import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          reactLibs: ['react', 'react-dom'],
          uiLibs: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
});
