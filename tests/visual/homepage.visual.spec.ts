import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const referenceUrl = "http://127.0.0.1:4173/";
const currentUrl = "http://127.0.0.1:3000/";
const currentScreenshotsDirectory = path.resolve("tests/visual/current");

const viewports = [
  { name: "homepage-desktop", width: 1440, height: 1100 },
  { name: "homepage-tablet", width: 900, height: 1100 },
  { name: "homepage-mobile", width: 390, height: 844 },
  { name: "breakpoint-951", width: 951, height: 1000 },
  { name: "breakpoint-950", width: 950, height: 1000 },
  { name: "breakpoint-621", width: 621, height: 900 },
  { name: "breakpoint-620", width: 620, height: 900 },
] as const;

interface LayoutShiftWindow extends Window {
  __layoutShiftScore?: number;
}

test.beforeAll(() => {
  mkdirSync(currentScreenshotsDirectory, { recursive: true });
});

async function preparePage(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      html {
        scroll-behavior: auto !important;
      }

      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }

      nextjs-portal {
        display: none !important;
      }
    `,
  });

  await page.locator("details").evaluateAll((details) => {
    for (const element of details) {
      element.removeAttribute("open");
    }
  });

  const images = page.locator("img");
  for (let index = 0; index < (await images.count()); index += 1) {
    const image = images.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    await expect
      .poll(() =>
        image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }

  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, 0);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

async function normalizeIntentionalComparisonDifferences(
  page: Page,
  width: number,
) {
  if (width <= 950) {
    await page.addStyleTag({
      content: "footer { padding-bottom: 32px !important; }",
    });
  }
}

async function gridColumnCount(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => {
    const columns = getComputedStyle(element).gridTemplateColumns.trim();
    return columns.length === 0 ? 0 : columns.split(/\s+/).length;
  });
}

async function verifyReferenceBreakpoint(page: Page, width: number) {
  const nav = page.locator("header nav");
  const brandName = page.locator(".brand span:last-child");
  const mobileBar = page.locator(".sticky-buy");

  if (width === 951) {
    await expect(nav).toBeVisible();
    await expect(mobileBar).toBeHidden();
    expect(await gridColumnCount(page, ".hero")).toBe(2);
    expect(await gridColumnCount(page, ".pricing-grid")).toBe(3);
  }

  if (width === 950) {
    await expect(nav).toBeHidden();
    await expect(mobileBar).toBeVisible();
    expect(await gridColumnCount(page, ".hero")).toBe(1);
    expect(await gridColumnCount(page, ".pricing-grid")).toBe(1);
  }

  if (width === 621) {
    await expect(brandName).toBeVisible();
    expect(await gridColumnCount(page, ".cards")).toBe(2);
    expect(await gridColumnCount(page, ".saving-compare")).toBe(3);
    expect(
      await page
        .locator(".footer-inner")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("row");
    expect(
      await page
        .locator(".saving-amount")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("row");
  }

  if (width === 620) {
    await expect(brandName).toBeHidden();
    expect(await gridColumnCount(page, ".cards")).toBe(1);
    expect(await gridColumnCount(page, ".saving-compare")).toBe(1);
    expect(
      await page
        .locator(".footer-inner")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("column");
    expect(
      await page
        .locator(".saving-amount")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("column");
    expect((await page.locator(".hero").boundingBox())?.x).toBe(12);
  }
}

async function verifyCurrentBreakpoint(page: Page, width: number) {
  const nav = page.getByTestId("header-nav");
  const brandName = page.getByTestId("brand-name");
  const mobileBar = page.getByTestId("mobile-purchase-bar");

  if (width === 951) {
    await expect(nav).toBeVisible();
    await expect(mobileBar).toBeHidden();
    expect(await gridColumnCount(page, '[data-testid="hero-grid"]')).toBe(2);
    expect(await gridColumnCount(page, '[data-testid="pricing-grid"]')).toBe(3);
    expect(
      await page
        .getByTestId("featured-plan")
        .evaluate((element) => getComputedStyle(element).translate),
    ).not.toBe("none");
  }

  if (width === 950) {
    await expect(nav).toBeHidden();
    await expect(mobileBar).toBeVisible();
    expect(await gridColumnCount(page, '[data-testid="hero-grid"]')).toBe(1);
    expect(await gridColumnCount(page, '[data-testid="pricing-grid"]')).toBe(1);
    expect(
      await page
        .getByTestId("featured-plan")
        .evaluate((element) => getComputedStyle(element).translate),
    ).toBe("0px");
  }

  if (width === 621) {
    await expect(brandName).toBeVisible();
    expect(await gridColumnCount(page, '[data-testid="benefits-grid"]')).toBe(
      2,
    );
    expect(await gridColumnCount(page, '[data-testid="saving-compare"]')).toBe(
      3,
    );
    expect(
      await page
        .getByTestId("footer-inner")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("row");
    expect(
      await page
        .getByTestId("saving-amount")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("row");
  }

  if (width === 620) {
    await expect(brandName).toBeHidden();
    expect(await gridColumnCount(page, '[data-testid="benefits-grid"]')).toBe(
      1,
    );
    expect(await gridColumnCount(page, '[data-testid="saving-compare"]')).toBe(
      1,
    );
    expect(
      await page
        .getByTestId("footer-inner")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("column");
    expect(
      await page
        .getByTestId("saving-amount")
        .evaluate((element) => getComputedStyle(element).flexDirection),
    ).toBe("column");
    expect((await page.getByTestId("hero-grid").boundingBox())?.x).toBe(12);

    const actionWidth = (await page.getByTestId("hero-actions").boundingBox())
      ?.width;
    const buttonWidths = await page
      .getByTestId("hero-actions")
      .locator(".site-button")
      .evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().width),
      );
    expect(
      buttonWidths.every(
        (widthValue) => Math.abs(widthValue - (actionWidth ?? 0)) < 1,
      ),
    ).toBe(true);
  }
}

for (const viewport of viewports) {
  test(`${viewport.name}: reference и Next.js`, async ({ page }, testInfo) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });

    await preparePage(page, referenceUrl);
    await expectNoHorizontalOverflow(page);
    await verifyReferenceBreakpoint(page, viewport.width);

    const screenshotName = `${viewport.name}.png`;
    await expect(page).toHaveScreenshot(screenshotName, {
      animations: "disabled",
      fullPage: true,
    });

    if (
      testInfo.config.updateSnapshots === "all" ||
      testInfo.config.updateSnapshots === "changed"
    ) {
      return;
    }

    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.addInitScript(() => {
      const trackedWindow = window as LayoutShiftWindow;
      trackedWindow.__layoutShiftScore = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShift.hadRecentInput) {
            trackedWindow.__layoutShiftScore =
              (trackedWindow.__layoutShiftScore ?? 0) +
              (layoutShift.value ?? 0);
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await preparePage(page, currentUrl);
    await expectNoHorizontalOverflow(page);
    await verifyCurrentBreakpoint(page, viewport.width);
    await page.screenshot({
      animations: "disabled",
      fullPage: true,
      path: path.join(currentScreenshotsDirectory, screenshotName),
    });

    const layoutShiftScore = await page.evaluate(
      () => (window as LayoutShiftWindow).__layoutShiftScore ?? 0,
    );
    expect(layoutShiftScore).toBeLessThanOrEqual(0.02);

    await normalizeIntentionalComparisonDifferences(page, viewport.width);
    await expect(page).toHaveScreenshot(screenshotName, {
      animations: "disabled",
      fullPage: true,
      maxDiffPixelRatio: 0.025,
    });
    expect(consoleErrors).toEqual([]);
  });
}

test("изображения и accessibility smoke-check", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await preparePage(page, currentUrl);

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main h2")).toHaveCount(7);
  await expect(page.locator("h3")).toHaveCount(12);
  await expect(page.locator("section")).toHaveCount(10);

  const heroImage = page.getByAltText(
    "Консультация по эстетической трихологии",
  );
  const diagnosticsImage = page.getByAltText("Диагностика кожи головы");
  for (const image of [heroImage, diagnosticsImage]) {
    await expect(image).toHaveAttribute("width", "1448");
    await expect(image).toHaveAttribute("height", "1086");
    expect(
      await image.evaluate((element) => getComputedStyle(element).objectFit),
    ).toBe("cover");
  }
  await expect(heroImage).not.toHaveAttribute("loading", "lazy");
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveCount(1);
  await expect(diagnosticsImage).toHaveAttribute("loading", "lazy");

  const skipLink = page.getByRole("link", {
    name: "Перейти к основному содержимому",
  });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  expect(
    await skipLink.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    ),
  ).not.toBe("none");

  const firstSummary = page.locator("summary").first();
  await firstSummary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(page.locator("details").first()).not.toHaveAttribute("open", "");

  for (const button of await page.getByRole("button").all()) {
    await expect(button).toHaveAttribute("type", "button");
    expect((await button.innerText()).trim().length).toBeGreaterThan(0);
  }

  for (const anchorId of ["top", "inside", "plans", "faq"]) {
    await expect(page.locator(`#${anchorId}`)).toHaveCount(1);
  }
});
