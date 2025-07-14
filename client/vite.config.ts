import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// @ts-expect-error it is js file and cannot convert to ts
import { DEFAULT_PORT } from '../shared/constants.js';

// console.log('DEFAULT_PORT:', DEFAULT_PORT);

// pnpm dev:server port
const SERVER_PORT = DEFAULT_PORT;

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
