import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",  // Fix lỗi đường dẫn khi deploy
  build: {
    outDir: "dist",
    assetsDir: "assets"
  },
  server: {
    historyApiFallback: true, // Fix lỗi khi dùng React Router
  }
});
