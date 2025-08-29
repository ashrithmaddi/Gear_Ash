import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://gearash-production.up.railway.app'
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
