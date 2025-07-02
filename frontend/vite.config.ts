import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      './components/IPDetails': fileURLToPath(new URL('./src/components/IPDetails.tsx', import.meta.url)),
      './components/IPMap': fileURLToPath(new URL('./src/components/IPMap.tsx', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild', // Use esbuild for minification (faster and doesn't require terser)
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          reactBootstrap: ['react-bootstrap', 'bootstrap'],
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  // Ensure environment variables are properly passed to the client
  
});
