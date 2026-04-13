import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    // Code splitting for better caching
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        simulator: resolve(__dirname, 'src/simulator.html'),
      },
      output: {
        manualChunks: {
          simulator: ['./src/js/modules/simulator-logic.js'],
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Target modern browsers for smaller output
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'LIIT x AMBOSS Arquitectura',
        short_name: 'LIIT|AMBOSS',
        description: 'Estudio de Arquitectura y Construcción — Diseño Fresco, Ejecución Sólida.',
        theme_color: '#000000',
        background_color: '#111111',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['architecture', 'design', 'construction'],
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        screenshots: [],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // Cache Google Fonts (1 year)
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Cache Unsplash images (30 days)
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  // Dev server optimizations
  server: {
    port: 3000,
    open: true,
  },

  // CSS processing
  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },
})
