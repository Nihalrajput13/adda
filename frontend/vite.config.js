import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Khiladi Adda - Play & Win',
        short_name: 'KhiladiAdda',
        description: 'Play games and win real money',
        theme_color: '#dc143c',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    // Middleware to enable SPA fallback:
    // This makes sure all routes fallback to index.html so React Router works properly.
    middlewareMode: false,
    setupMiddlewares(middlewares, devServer) {
      middlewares.unshift(
        history({
          htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
        }),
      );
      return middlewares;
    },
  },
});
