import { expect, test } from "@playwright/test";

test("пустые environment values обрабатываются безопасно", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByTestId("purchase-trigger-guide").click();

  const dialog = page.locator("#buyDialog");
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog.getByRole("button", { name: "Копировать" })).toHaveCount(
    3,
  );

  for (const id of ["account", "recipient", "purpose"]) {
    const row = dialog.locator(`[data-payment-detail="${id}"]`);
    await expect(row).toContainText("Не указано");
    const button = row.getByRole("button", { name: "Копировать" });
    await expect(button).toBeDisabled();
  }

  await expect(page.getByTestId("telegram-purchase-link")).toHaveCount(0);
  await expect(page.getByTestId("email-purchase-link")).toHaveCount(0);
  await expect(page.getByTestId("telegram-purchase-fallback")).toBeVisible();
  await expect(page.getByTestId("email-purchase-fallback")).toBeVisible();
  await expect(dialog).not.toContainText("YOUR_TELEGRAM");
  await expect(dialog).not.toContainText("your@email.com");
  await expect(dialog).not.toContainText("УКАЖИТЕ РЕКВИЗИТЫ");
  await expect(dialog).not.toContainText("УКАЖИТЕ ИМЯ");
  expect(runtimeErrors).toEqual([]);
});
