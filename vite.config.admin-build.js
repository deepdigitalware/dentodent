import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets
  root: resolve(__dirname, 'admin'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'admin'),
      'shared-assets': resolve(__dirname, 'frontend', 'src', 'assets', 'icons')
    }
  },
  build: {
    outDir: resolve(__dirname, 'admin', 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'admin/admin.html')
      }
    }
  },
  server: {
    port: 6001
  }
});
