import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
<<<<<<< HEAD
  testDir: "./e2e",
=======
  timeout: 60000, // Increased global timeout
  testDir: './e2e',
>>>>>>> main
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 60 * 1000, // Timeout global aumentado (60s)
  use: {
<<<<<<< HEAD
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure", // Trace apenas em falha
    video: "retain-on-failure", // Vídeo apenas em falha
    screenshot: "only-on-failure",
=======
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
>>>>>>> main
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "safari", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
