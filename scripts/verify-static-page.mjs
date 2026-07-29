import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = resolve(projectRoot, "src/app/page.tsx");
const pageSource = readFileSync(pagePath, "utf8");
const failures = [];

const sectionComponents = [
  "HeroSection",
  "TrustBar",
  "BenefitsSection",
  "ExpertiseBoundarySection",
  "GuideContentsSection",
  "IncomeCalculationSection",
  "QuoteSection",
  "InvestmentSection",
  "PricingSection",
  "FaqSection",
];

const layoutComponents = ["SiteHeader", "SiteFooter", "MobilePurchaseBar"];

function fail(message) {
  failures.push(message);
}

function requireIncludes(label, source, expected) {
  if (!source.includes(expected)) {
    fail(`${label}: отсутствует ${JSON.stringify(expected)}`);
  }
}

const sectionSources = [];
for (const componentName of sectionComponents) {
  const componentPath = resolve(
    projectRoot,
    `src/components/sections/${componentName}.tsx`,
  );

  if (!existsSync(componentPath)) {
    fail(`Не найден section component ${componentName}`);
    continue;
  }

  const source = readFileSync(componentPath, "utf8");
  sectionSources.push(source);
  requireIncludes(
    `Импорт ${componentName}`,
    pageSource,
    `import { ${componentName} }`,
  );
  requireIncludes(
    `Рендер ${componentName}`,
    pageSource,
    `<${componentName} />`,
  );
}

for (const componentName of layoutComponents) {
  const componentPath = resolve(
    projectRoot,
    `src/components/layout/${componentName}.tsx`,
  );

  if (!existsSync(componentPath)) {
    fail(`Не найден layout component ${componentName}`);
    continue;
  }

  requireIncludes(
    `Импорт ${componentName}`,
    pageSource,
    `import { ${componentName} }`,
  );
  requireIncludes(
    `Рендер ${componentName}`,
    pageSource,
    `<${componentName} />`,
  );
}

let previousRenderIndex = -1;
for (const componentName of sectionComponents) {
  const renderIndex = pageSource.indexOf(`<${componentName} />`);
  if (renderIndex <= previousRenderIndex) {
    fail(`Нарушен порядок рендера секций около ${componentName}`);
  }
  previousRenderIndex = renderIndex;
}

const combinedSectionSource = sectionSources.join("\n");
const allTsxPaths = [
  pagePath,
  ...sectionComponents.map((name) =>
    resolve(projectRoot, `src/components/sections/${name}.tsx`),
  ),
  ...layoutComponents.map((name) =>
    resolve(projectRoot, `src/components/layout/${name}.tsx`),
  ),
  ...["Container", "Button", "SectionHeading", "PriceDisplay"].map((name) =>
    resolve(projectRoot, `src/components/ui/${name}.tsx`),
  ),
];
const existingTsxSources = allTsxPaths
  .filter((path) => existsSync(path))
  .map((path) => readFileSync(path, "utf8"));
const combinedTsxSource = existingTsxSources.join("\n");

const sectionCount = combinedSectionSource.match(/<section\b/g)?.length ?? 0;
if (sectionCount !== 10) {
  fail(`Ожидалось 10 тегов <section>, найдено ${sectionCount}`);
}

const h1Count = combinedTsxSource.match(/<h1\b/g)?.length ?? 0;
if (h1Count !== 1) {
  fail(`Ожидался один <h1>, найдено ${h1Count}`);
}

const imageCount = combinedTsxSource.match(/<Image\b/g)?.length ?? 0;
if (imageCount !== 2) {
  fail(`Ожидалось два next/image, найдено ${imageCount}`);
}

requireIncludes("Главный anchor", pageSource, '<main id="top">');
requireIncludes(
  "Anchor inside",
  combinedSectionSource,
  "id={guideContentsContent.anchorId}",
);
requireIncludes(
  "Anchor plans",
  combinedSectionSource,
  "id={pricingIntroContent.anchorId}",
);
requireIncludes(
  "Anchor faq",
  combinedSectionSource,
  "id={faqIntroContent.anchorId}",
);

requireIncludes(
  "Hero image registry",
  combinedSectionSource,
  "siteImages.heroConsultation",
);
requireIncludes(
  "Expertise image registry",
  combinedSectionSource,
  "siteImages.scalpDiagnostics",
);
requireIncludes("Pricing array", combinedSectionSource, "plans.map");
requireIncludes("FAQ array", combinedSectionSource, "faqItems.map");
requireIncludes("Hero image priority", combinedSectionSource, "priority");
requireIncludes("Purchase button bridge", combinedTsxSource, "PurchaseButton");
requireIncludes("Static legal marker", combinedTsxSource, "data-legal");

const siteSource = readFileSync(
  resolve(projectRoot, "src/content/site.ts"),
  "utf8",
);
for (const anchor of ["top", "inside", "plans", "faq"]) {
  requireIncludes(
    `Content anchor ${anchor}`,
    siteSource,
    `${anchor}: "${anchor}"`,
  );
}

const plansSource = readFileSync(
  resolve(projectRoot, "src/content/plans.ts"),
  "utf8",
);
const planCount =
  plansSource.match(/\bid: "(?:guide|ai|premium)"/g)?.length ?? 0;
if (planCount !== 3) {
  fail(`Ожидалось 3 тарифа, найдено ${planCount}`);
}

const faqSource = readFileSync(
  resolve(projectRoot, "src/content/faq.ts"),
  "utf8",
);
const faqCount =
  faqSource.match(
    /\bid: "(?:medical|barber|delivery|ai-assistant|premium|printing)"/g,
  )?.length ?? 0;
if (faqCount !== 6) {
  fail(`Ожидалось 6 FAQ, найдено ${faqCount}`);
}

const forbiddenPatterns = [
  { label: '"use client"', pattern: /["']use client["']/ },
  { label: "onClick", pattern: /\bonClick\s*=/ },
  { label: "dangerouslySetInnerHTML", pattern: /dangerouslySetInnerHTML/ },
  { label: "window", pattern: /\bwindow\./ },
  { label: "document", pattern: /\bdocument\./ },
  { label: "navigator", pattern: /\bnavigator\./ },
  { label: "gallery", pattern: /\bgallery\b/i },
];

for (const { label, pattern } of forbiddenPatterns) {
  if (pattern.test(combinedTsxSource)) {
    fail(`В статической странице найдено запрещённое: ${label}`);
  }
}

if (failures.length > 0) {
  console.error("Проверка статической страницы завершилась с ошибками:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("Server Components: 17");
  console.log("Section components: 10");
  console.log("Section order: подтверждён");
  console.log("Public anchors: top, inside, plans, faq");
  console.log("next/image: 2");
  console.log("Plans: 3");
  console.log("FAQ: 6");
  console.log(
    "Server page/sections/layout/UI remain free of client directives",
  );
  console.log("Purchase interactivity is delegated to the client island");
  console.log("dangerouslySetInnerHTML and gallery: absent");
}
