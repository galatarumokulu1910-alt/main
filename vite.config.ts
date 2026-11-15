import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('openseadragon')) return 'vendor-openseadragon';
          if (id.includes('react-datepicker') || id.includes('date-fns')) return 'vendor-datepicker';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-motion';
          return undefined;
        },
      },
    },
  },
});
