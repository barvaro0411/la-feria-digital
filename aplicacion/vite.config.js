import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Nubi AI - Asistente Financiero',
        short_name: 'Nubi AI',
        description: 'Gestiona tus finanzas y encuentra los mejores descuentos con IA.',
        theme_color: '#0F172A',
        icons: [
          {
            src: 'nubi-logo.jpg', // Asegúrate de tener una versión 192x192 y 512x512 idealmente
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'nubi-logo.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
});