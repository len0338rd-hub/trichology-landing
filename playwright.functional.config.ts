import { defineConfig } from "@playwright/test";

const isEmptyEnvironment = process.env.PURCHASE_TEST_MODE === "empty";
const port = isEmptyEnvironment ? 3101 : 3100;
const baseURL = `http://127.0.0.1:${port}`;

const purchaseEnvironment = isEmptyEnvironment
  ? {
      NEXT_PUBLIC_TELEGRAM_USERNAME: "",
      NEXT_PUBLIC_CONTACT_EMAIL: "",
      NEXT_PUBLIC_PAYMENT_ACCOUNT: "",
      NEXT_PUBLIC_PAYMENT_RECIPIENT: "",
      NEXT_PUBLIC_PAYMENT_PURPOSE: "",
    }
  : {
      NEXT_PUBLIC_TELEGRAM_USERNAME: "  @TEST_TELEGRAM  ",
      NEXT_PUBLIC_CONTACT_EMAIL: "test@example.invalid",
      NEXT_PUBLIC_PAYMENT_ACCOUNT: "PL00 0000 0000 0000",
      NEXT_PUBLIC_PAYMENT_RECIPIENT: "Test Recipient",
      NEXT_PUBLIC_PAYMENT_PURPOSE: "Test payment purpose",
    };

export default defineConfig({
  testDir: "./tests/functional",
  testMatch: isEmptyEnvironment
    ? "purchase-empty.spec.ts"
    : ["purchase.spec.ts", "privacy.spec.ts"],
  outputDir: isEmptyEnvironment
    ? "./test-results/functional-empty"
    : "./test-results/functional",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    browserName: "chromium",
    colorScheme: "light",
    deviceScaleFactor: 1,
    headless: true,
    locale: "ru-RU",
    permissions: ["clipboard-read", "clipboard-write"],
    timezoneId: "Europe/Warsaw",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    env: {
      ...process.env,
      ...purchaseEnvironment,
      NEXT_DIST_DIR: `.next-functional-${port}`,
      STRIPE_SECRET_KEY: "",
      STRIPE_WEBHOOK_SECRET: "",
      STRIPE_PRICE_GUIDE: "",
      STRIPE_PRICE_AI: "",
      STRIPE_PRICE_PREMIUM: "",
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
});
