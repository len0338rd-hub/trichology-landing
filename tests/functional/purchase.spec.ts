import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const screenshotsDirectory = path.resolve("tests/functional/screenshots");
const runtimeErrors = new WeakMap<Page, string[]>();

const planCases = [
  {
    testId: "purchase-trigger-investment",
    name: "Практический гайд",
    price: "79 PLN",
    oldPrice: "100 PLN",
  },
  {
    testId: "purchase-trigger-guide",
    name: "Практический гайд",
    price: "79 PLN",
    oldPrice: "100 PLN",
  },
  {
    testId: "purchase-trigger-ai",
    name: "Гайд + AI-ассистент",
    price: "179 PLN",
    oldPrice: "249 PLN",
  },
  {
    testId: "purchase-trigger-premium",
    name: "Премиум-внедрение",
    price: "499 PLN",
    oldPrice: "599 PLN",
  },
] as const;

async function openPurchase(page: Page, testId: string) {
  const trigger = page.getByTestId(testId);
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await expect(page.locator("#buyDialog")).toHaveJSProperty("open", true);
  return trigger;
}

async function closeWithButton(page: Page) {
  await page.getByRole("button", { name: "Закрыть окно покупки" }).click();
  await expect(page.locator("#buyDialog")).not.toHaveJSProperty("open", true);
}

test.beforeAll(() => {
  mkdirSync(screenshotsDirectory, { recursive: true });
});

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/", { waitUntil: "networkidle" });
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page) ?? []).toEqual([]);
});

for (const planCase of planCases) {
  test(`выбор тарифа через ${planCase.testId}`, async ({ page }) => {
    const trigger = await openPurchase(page, planCase.testId);
    const dialog = page.locator("#buyDialog");

    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
      planCase.name,
    );
    await expect(page.getByTestId("purchase-current-price")).toHaveText(
      planCase.price,
    );
    await expect(page.getByTestId("purchase-old-price")).toHaveText(
      planCase.oldPrice,
    );
    await expect(
      page.getByRole("button", { name: "Закрыть окно покупки" }),
    ).toBeFocused();

    await closeWithButton(page);
    await expect(trigger).toBeFocused();
  });
}

test("закрытие по Escape, backdrop и только по внешней области", async ({
  page,
}) => {
  const trigger = await openPurchase(page, "purchase-trigger-guide");
  await page.keyboard.press("Escape");
  await expect(page.locator("#buyDialog")).not.toHaveJSProperty("open", true);
  await expect(trigger).toBeFocused();

  await openPurchase(page, "purchase-trigger-guide");
  await page.locator("#paymentDetails").click();
  await expect(page.locator("#buyDialog")).toHaveJSProperty("open", true);

  const box = await page.locator("#buyDialog").boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(Math.max(1, (box?.x ?? 30) - 20), box?.y ?? 1);
  await expect(page.locator("#buyDialog")).not.toHaveJSProperty("open", true);
  await expect(trigger).toBeFocused();
});

test("Clipboard работает отдельно для трёх реквизитов", async ({ page }) => {
  await openPurchase(page, "purchase-trigger-guide");

  const cases = [
    { id: "account", value: "PL00 0000 0000 0000" },
    { id: "recipient", value: "Test Recipient" },
    { id: "purpose", value: "Test payment purpose" },
  ] as const;

  for (const copyCase of cases) {
    const row = page.locator(`[data-payment-detail="${copyCase.id}"]`);
    const button = row.locator("button");
    await expect(button).toHaveText("Копировать");
    await button.click();
    await expect(button).toHaveText("Скопировано");
    await expect(row.getByRole("status")).toHaveText("Скопировано");
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(copyCase.value);
  }

  await expect(
    page.locator('[data-payment-detail="purpose"] button'),
  ).toHaveText("Скопировано");
  await expect
    .poll(
      () =>
        page.locator('[data-payment-detail="purpose"] button').textContent(),
      { timeout: 3_000 },
    )
    .toBe("Копировать");
});

test("Telegram и email URL содержат выбранный тариф", async ({ page }) => {
  await openPurchase(page, "purchase-trigger-ai");

  const consent = page.getByTestId("digital-delivery-consent");
  await expect(consent).not.toBeChecked();
  await expect(page.getByTestId("telegram-purchase-link")).toHaveCount(0);
  await expect(page.getByTestId("email-purchase-link")).toHaveCount(0);
  await consent.check();

  const telegramLink = page.getByTestId("telegram-purchase-link");
  const telegramHref = await telegramLink.getAttribute("href");
  expect(telegramHref).not.toBeNull();
  const telegramUrl = new URL(telegramHref ?? "");
  expect(telegramUrl.protocol).toBe("https:");
  expect(telegramUrl.hostname).toBe("t.me");
  expect(telegramUrl.pathname).toBe("/TEST_TELEGRAM");
  expect(telegramUrl.searchParams.get("text")).toContain("Гайд + AI-ассистент");
  expect(telegramUrl.searchParams.get("text")).toContain("179 PLN");
  expect(telegramUrl.searchParams.get("text")).toContain(
    "Прошу предоставить PDF‑гайд сразу",
  );
  await expect(telegramLink).toHaveAttribute("target", "_blank");
  await expect(telegramLink).toHaveAttribute("rel", "noopener noreferrer");

  const emailLink = page.getByTestId("email-purchase-link");
  const emailHref = await emailLink.getAttribute("href");
  expect(emailHref).not.toBeNull();
  const emailUrl = new URL(emailHref ?? "");
  expect(emailUrl.protocol).toBe("mailto:");
  expect(emailUrl.pathname).toBe("test@example.invalid");
  expect(emailUrl.searchParams.get("subject")).toBe(
    "Оплата обучения по эстетической трихологии",
  );
  expect(emailUrl.searchParams.get("body")).toContain("Гайд + AI-ассистент");
  expect(emailUrl.searchParams.get("body")).toContain("179 PLN");
  expect(emailUrl.searchParams.get("body")).toContain(
    "Прошу предоставить PDF‑гайд сразу",
  );
});

test("native dialog удерживает фокус и возвращает его trigger", async ({
  page,
}) => {
  const trigger = await openPurchase(page, "purchase-trigger-premium");
  const dialog = page.locator("#buyDialog");

  await expect(dialog).toHaveAccessibleName("Премиум-внедрение");
  await expect(
    page.getByRole("button", { name: "Закрыть окно покупки" }),
  ).toBeVisible();

  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => {
        const dialogElement = document.querySelector("#buyDialog");
        return Boolean(
          dialogElement &&
          document.activeElement &&
          dialogElement.contains(document.activeElement),
        );
      }),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).not.toHaveJSProperty("open", true);
  await expect(trigger).toBeFocused();
});

test("Stripe безопасно выключен до добавления серверных настроек", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await openPurchase(page, "purchase-trigger-guide");

  await expect(page.getByTestId("stripe-checkout-button")).toBeDisabled();
  await expect(page.getByTestId("stripe-checkout-button")).toHaveText(
    "Stripe скоро будет доступен",
  );

  const unconfiguredResponse = await request.post("/api/stripe/checkout", {
    data: { planId: "guide" },
  });
  expect(unconfiguredResponse.status()).toBe(503);

  const invalidPlanResponse = await request.post("/api/stripe/checkout", {
    data: { planId: "unknown" },
  });
  expect(invalidPlanResponse.status()).toBe(400);
});

const screenshotCases = [
  {
    name: "purchase-guide-desktop.png",
    testId: "purchase-trigger-guide",
    width: 1440,
    height: 1100,
  },
  {
    name: "purchase-ai-mobile.png",
    testId: "purchase-trigger-ai",
    width: 390,
    height: 844,
  },
  {
    name: "purchase-premium-tablet.png",
    testId: "purchase-trigger-premium",
    width: 900,
    height: 1100,
  },
] as const;

for (const screenshotCase of screenshotCases) {
  test(`screenshot ${screenshotCase.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: screenshotCase.width,
      height: screenshotCase.height,
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await openPurchase(page, screenshotCase.testId);
    await page.screenshot({
      animations: "disabled",
      path: path.join(screenshotsDirectory, screenshotCase.name),
    });
  });
}
