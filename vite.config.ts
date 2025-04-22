import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DisCalc/',
  plugins: [react()],
  server: {
    port: 5174, // change if you want a different port
  },
});
