import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression(),
    visualizer({ open: false })
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
});
