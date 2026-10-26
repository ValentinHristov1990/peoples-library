import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  use: {
    baseURL: "http://localhost:5173",
    headless: false,
  },
});
