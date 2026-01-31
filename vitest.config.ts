import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    coverage: { reporter: ["text", "json", "html"] },
    include: ["**/*.{test,spec}.{ts,tsx}"],
    reporters: ["verbose"],
    globalSetup: ["./test/globalSetup.ts"],
    alias: {
      // Mock Service Worker alias if we decide to use it later, prepared as requested
      // "msw/node": path.resolve(__dirname, "./node_modules/msw/node"),
    }
  },
});
