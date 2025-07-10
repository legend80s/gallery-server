import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// pnpm dev:server port
const SERVER_PORT = 6834;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
      },
      '/photos': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/photos/, ''),
      },
      '/videos': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/videos/, ''),
      },
    },
  },
});
