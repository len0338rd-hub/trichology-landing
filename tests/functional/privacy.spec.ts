import { expect, test } from "@playwright/test";

test("политика RODO доступна из footer и содержит обязательную информацию", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const privacyLink = page.getByRole("link", { name: "Конфиденциальность" });
  await expect(privacyLink).toHaveAttribute("href", "/privacy");
  await privacyLink.click();

  await expect(page).toHaveURL(/\/privacy$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Политика конфиденциальности",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Администратор персональных данных"),
  ).toBeVisible();
  await expect(page.getByText("Ст. 6(1)(b)")).toBeVisible();
  await expect(page.getByText("Ст. 6(1)(c)")).toBeVisible();
  await expect(page.getByText("Ст. 6(1)(f)")).toBeVisible();
  await expect(page.getByText("Президенту польского")).toBeVisible();
});

test("публичная оферта доступна из footer", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const offerLink = page.getByRole("link", { name: "Публичная оферта" });
  await expect(offerLink).toHaveAttribute("href", "/offer");
  await offerLink.click();

  await expect(page).toHaveURL(/\/offer$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Публичная оферта" }),
  ).toBeVisible();
  await expect(page.getByText("Продавец", { exact: true })).toBeVisible();
  await expect(page.getByText("0001224953 / 544048149")).toBeVisible();
});

test("контакты доступны из footer даже без JavaScript", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const contactLink = page.getByRole("link", { name: "Контакты" });
  await expect(contactLink).toHaveAttribute("href", "/contact");
  await contactLink.click();

  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Контакты" }),
  ).toBeVisible();
  await expect(page.getByText("0001224953")).toBeVisible();
});
