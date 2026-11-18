import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/supabase-media': {
        target: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-media/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/supabase-media': {
        target: 'https://tvloakrlqazcadokliaf.supabase.co/storage/v1/object/public/media',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-media/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('preservedLegacyEvents.json')) return 'data-legacy-events';
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('openseadragon')) return 'vendor-openseadragon';
          if (id.includes('react-datepicker') || id.includes('date-fns')) return 'vendor-datepicker';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-motion';
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('react-helmet-async') ||
            id.includes('scheduler') ||
            /[\\/]node_modules[\\/]react[\\/]/.test(id)
          ) {
            return 'vendor-react';
          }
          return undefined;
        },
      },
    },
  },
});
