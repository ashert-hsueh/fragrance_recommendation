import baseConfig from "./playwright.config";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...baseConfig,
  projects: baseConfig.projects?.filter((project) => project.name === "chromium"),
  webServer: {
    command: "npx next dev -H 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
