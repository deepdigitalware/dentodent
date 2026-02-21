import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend/src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        frontend: resolve(__dirname, 'frontend/src/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        // Split vendor chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-helmet-async', 'react-hot-toast'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          animation: ['framer-motion'],
          icons: ['lucide-react']
        }
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
      }
    },
    outDir: 'dist'
  },
  server: {
    port: 3000,
    // Enable gzip compression for development server
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    }
  }
});
