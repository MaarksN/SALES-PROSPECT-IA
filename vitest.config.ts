<<<<<<< HEAD
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
=======
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';
>>>>>>> main

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "jsdom",
    globals: true,
<<<<<<< HEAD
    setupFiles: ["./src/setupTests.ts"],
    coverage: { reporter: ["text", "json", "html"] },
    include: ["**/*.{test,spec}.{ts,tsx}"],
    reporters: ["verbose"],
    globalSetup: ["./test/globalSetup.ts"],
    alias: {
      // Mock Service Worker alias if we decide to use it later, prepared as requested
      // "msw/node": path.resolve(__dirname, "./node_modules/msw/node"),
    }
=======
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache', 'e2e/**', 'server/**'],
    reporters: ['verbose'],
    globalSetup: './test/globalSetup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
>>>>>>> main
  },
});
