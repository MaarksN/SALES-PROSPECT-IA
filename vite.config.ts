<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";
=======
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
>>>>>>> main

export default defineConfig({
  plugins: [
    react(),
    compression(),
    visualizer({ open: false }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: false,
      },
<<<<<<< HEAD
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Sales Prospector v2",
        short_name: "Prospector",
        description: "Inteligência Artificial para Vendas B2B",
        theme_color: "#4f46e5",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor_react: ["react", "react-dom", "react-router-dom"],
          vendor_ui: ["framer-motion", "lucide-react", "recharts", "sonner", "clsx", "tailwind-merge"],
          vendor_utils: ["date-fns", "zod", "axios", "@tanstack/react-query", "zustand"],
          vendor_db: ["@supabase/supabase-js", "@google/generative-ai"],
        },
      },
    },
  },
=======
      build: {
        manifest: true,
      },
      optimizeDeps: {
        include: ['react-window', 'react-virtualized-auto-sizer']
      },
      plugins: [
        react(),
        checker({ typescript: true }),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          manifest: {
            name: 'Sales Prospector AI',
            short_name: 'SalesAI',
            description: 'AI-powered sales prospecting tool',
            theme_color: '#ffffff',
            icons: [
              {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          }
        }),
        viteImagemin({
          gifsicle: { optimizationLevel: 7 },
          optipng: { optimizationLevel: 7 },
          mozjpeg: { quality: 20 },
          pngquant: { quality: [0.8, 0.9], speed: 4 },
        }),
      ],
      // Removed API Key exposure via 'define'.
      // Keys are now handled by the BFF server.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
>>>>>>> main
});
