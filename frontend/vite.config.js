import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    }
  },
  define: {
    global: 'globalThis',
  }
});
