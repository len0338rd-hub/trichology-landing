import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  outputDir: "./test-results/visual",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      threshold: 0.2,
    },
  },
  use: {
    browserName: "chromium",
    colorScheme: "light",
    deviceScaleFactor: 1,
    headless: true,
    locale: "ru-RU",
    timezoneId: "Europe/Warsaw",
    trace: "retain-on-failure",
  },
  snapshotPathTemplate: "{testDir}/reference/{arg}{ext}",
  webServer: [
    {
      command: "npm run reference:serve",
      url: "http://127.0.0.1:4173/",
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1",
      url: "http://127.0.0.1:3000/",
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
});
