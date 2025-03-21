import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.VITE_DISABLE_TYPE_CHECK === 'true' ? 
      { 
        name: 'disable-type-checking',
        handleHotUpdate({ server }) {
          server.config.logger.info('Type checking disabled');
          return [];
        }
      } : 
      null
  ].filter(Boolean),
  define: {
    // This ensures environment variables work correctly
    'process.env': {}
  }
})
