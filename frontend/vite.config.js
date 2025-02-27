import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: "index.html",
      output: {
        manualChunks: {
          reactLibs: ['react', 'react-dom'],
          uiLibs: ['@mui/material', '@mui/icons-material'],
          entryFileNames: "assets/index-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
    },
  },
});
