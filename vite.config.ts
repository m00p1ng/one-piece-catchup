import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'One Piece Catch-Up Plan',
        short_name: 'OP Catch-Up',
        description: 'Track your One Piece watching progress',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/one-piece-catchup/',
        start_url: '/one-piece-catchup/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/one-piece-catchup/index.html',
        navigateFallbackDenylist: [/^\/one-piece-catchup\/404\.html/],
      },
    }),
  ],
  base: '/one-piece-catchup/',
})
