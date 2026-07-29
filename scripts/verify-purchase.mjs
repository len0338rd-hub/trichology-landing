import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

const purchaseFiles = [
  "src/components/purchase/PurchaseProvider.tsx",
  "src/components/purchase/PurchaseButton.tsx",
  "src/components/purchase/PurchaseDialog.tsx",
  "src/components/purchase/PaymentDetailRow.tsx",
  "src/components/purchase/StripeCheckoutButton.tsx",
];

const serverFiles = [
  "src/app/page.tsx",
  "src/components/layout/SiteHeader.tsx",
  "src/components/layout/SiteFooter.tsx",
  "src/components/layout/MobilePurchaseBar.tsx",
  "src/components/sections/HeroSection.tsx",
  "src/components/sections/TrustBar.tsx",
  "src/components/sections/BenefitsSection.tsx",
  "src/components/sections/ExpertiseBoundarySection.tsx",
  "src/components/sections/GuideContentsSection.tsx",
  "src/components/sections/IncomeCalculationSection.tsx",
  "src/components/sections/QuoteSection.tsx",
  "src/components/sections/InvestmentSection.tsx",
  "src/components/sections/PricingSection.tsx",
  "src/components/sections/FaqSection.tsx",
];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  const absolutePath = resolve(projectRoot, relativePath);

  if (!existsSync(absolutePath)) {
    fail(`Не найден файл ${relativePath}`);
    return "";
  }

  return readFileSync(absolutePath, "utf8");
}

function requireText(label, source, text) {
  if (!source.includes(text)) {
    fail(`${label}: отсутствует ${JSON.stringify(text)}`);
  }
}

function collectSourceFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(path));
    } else if ([".ts", ".tsx"].includes(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

const purchaseSources = new Map(
  purchaseFiles.map((path) => [path, read(path)]),
);
const providerSource = purchaseSources.get(purchaseFiles[0]) ?? "";
const buttonSource = purchaseSources.get(purchaseFiles[1]) ?? "";
const dialogSource = purchaseSources.get(purchaseFiles[2]) ?? "";
const paymentRowSource = purchaseSources.get(purchaseFiles[3]) ?? "";
const stripeButtonSource = purchaseSources.get(purchaseFiles[4]) ?? "";
const investmentSource = read("src/components/sections/InvestmentSection.tsx");
const pricingSource = read("src/components/sections/PricingSection.tsx");
const pageSource = read("src/app/page.tsx");
const linksSource = read("src/lib/purchase-links.ts");
const messageSource = read("src/lib/purchase-message.ts");
const footerSource = read("src/components/layout/SiteFooter.tsx");
const packageSource = read("package.json");

for (const [path, source] of purchaseSources) {
  requireText(path, source, '"use client"');
}

for (const path of serverFiles) {
  const source = read(path);
  if (/^[\s\n]*["']use client["']/m.test(source)) {
    fail(`Server Component получил client directive: ${path}`);
  }
}

requireText("Provider plans", providerSource, 'from "@/content/plans"');
requireText("Provider fallback", providerSource, "fallbackPlanId");
requireText("Provider selected plan", providerSource, "selectedPlan");
requireText("Provider state", providerSource, "isPurchaseDialogOpen");
requireText("PurchaseButton action", buttonSource, "openPurchase(planId)");
requireText("Investment trigger", investmentSource, "<PurchaseButton");
requireText(
  "Investment guide trigger",
  investmentSource,
  "investmentContent.purchaseAction.planId",
);
requireText("Pricing plan loop", pricingSource, "plans.map");
requireText("Pricing triggers", pricingSource, "<PurchaseButton");
requireText("Pricing trigger ID", pricingSource, "planId={plan.id}");
requireText(
  "Guide trigger test ID",
  pricingSource,
  "purchase-trigger-${plan.id}",
);
requireText("Provider on page", pageSource, "<PurchaseProvider");
requireText("Dialog on page", pageSource, "<PurchaseDialog />");
requireText("Dialog ID", dialogSource, 'id="buyDialog"');
requireText("Dialog plans", dialogSource, "selectedPlan");
requireText(
  "Payment definitions",
  dialogSource,
  "paymentDetailDefinitions.map",
);
requireText("Telegram helper", dialogSource, "createTelegramPurchaseUrl");
requireText("Email helper", dialogSource, "createEmailPurchaseUrl");
requireText("Stripe checkout button", dialogSource, "<StripeCheckoutButton");
requireText(
  "Stripe checkout endpoint",
  stripeButtonSource,
  '"/api/stripe/checkout"',
);
requireText("Message builder", linksSource, "createPurchaseMessage");
requireText("Message template", messageSource, "messageTemplate");
requireText("Clipboard", paymentRowSource, "navigator.clipboard.writeText");
requireText("Clipboard error handling", paymentRowSource, "catch");
requireText("Functional npm script", packageSource, '"functional:test"');

const sourceFiles = collectSourceFiles(resolve(projectRoot, "src"));
const sourceEntries = sourceFiles.map((path) => ({
  path,
  source: readFileSync(path, "utf8"),
}));
const clientDirectiveFiles = sourceEntries.filter(({ source }) =>
  /^[\s\n]*["']use client["']/m.test(source),
);

if (clientDirectiveFiles.length !== purchaseFiles.length) {
  fail(
    `Ожидалось ${purchaseFiles.length} Client Components, найдено ${clientDirectiveFiles.length}`,
  );
}

const clipboardFiles = sourceEntries.filter(({ source }) =>
  source.includes("navigator.clipboard"),
);
if (
  clipboardFiles.length !== 1 ||
  !clipboardFiles[0]?.path.endsWith("PaymentDetailRow.tsx")
) {
  fail("Clipboard API должен использоваться только в PaymentDetailRow.tsx");
}

if (
  sourceEntries.some(({ source }) => source.includes("dangerouslySetInnerHTML"))
) {
  fail("Обнаружен dangerouslySetInnerHTML");
}

if (/\bonClick\s*=/.test(footerSource)) {
  fail("Legal interaction преждевременно добавлена в SiteFooter");
}

for (const forbiddenRoute of [
  "src/app/offer/page.tsx",
  "src/app/privacy/page.tsx",
]) {
  if (existsSync(resolve(projectRoot, forbiddenRoute))) {
    fail(`Преждевременно создан legal route: ${forbiddenRoute}`);
  }
}

if (failures.length > 0) {
  console.error("Проверка purchase island завершилась с ошибками:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Purchase Client Components: ${purchaseFiles.length}`);
  console.log("Purchase triggers: 4 (Investment + 3 plans)");
  console.log("Dialog: buyDialog");
  console.log("Clipboard scope: PaymentDetailRow only");
  console.log("Stripe/Telegram/email checkout actions: present");
  console.log("Server Components: client directives absent");
  console.log("Legal interactions/routes: absent");
}
