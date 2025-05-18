import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Use relative paths for GitHub Pages/Netlify
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  preview: {
    host: true,
    port: 8080,
    allowedHosts: ['localhost', 'app.sitepro.vn'], // Change this to your desired preview host
  },
});
