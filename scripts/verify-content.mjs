import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_HTML_SHA256 =
  "0c660260bc2d1950831737a90fad6a7cf32f2c2d62614f70be6acde555fdb56b";
const EXPECTED_COUNTS = {
  sections: 10,
  plans: 3,
  faq: 6,
  guideModules: 5,
  benefitCards: 4,
  trustItems: 4,
  dialogs: 2,
};

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(projectRoot, "reference/index.html");
const htmlBuffer = readFileSync(htmlPath);
const html = htmlBuffer.toString("utf8");
const failures = [];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function countMatches(value, pattern) {
  return value.match(pattern)?.length ?? 0;
}

function requireEqual(label, actual, expected) {
  if (actual !== expected) {
    failures.push(`${label}: ожидалось ${expected}, получено ${actual}`);
  }
}

function requireIncludes(label, value, required) {
  if (!value.includes(required)) {
    failures.push(`${label}: отсутствует ${JSON.stringify(required)}`);
  }
}

const htmlSha256 = sha256(htmlBuffer);
requireEqual("SHA-256 reference/index.html", htmlSha256, EXPECTED_HTML_SHA256);

const trustSection = html.match(
  /<section class="trustbar">([\s\S]*?)<\/section>/,
)?.[1];
if (!trustSection) {
  failures.push("Не найдена секция trustbar");
}

requireEqual(
  "Количество секций",
  countMatches(html, /<section\b/g),
  EXPECTED_COUNTS.sections,
);
requireEqual(
  "Количество тарифов",
  countMatches(html, /<article class="plan-card(?: featured)?">/g),
  EXPECTED_COUNTS.plans,
);
requireEqual(
  "Количество FAQ",
  countMatches(html, /<details\b/g),
  EXPECTED_COUNTS.faq,
);
requireEqual(
  "Количество модулей гайда",
  countMatches(html, /<div class="inside-item">/g),
  EXPECTED_COUNTS.guideModules,
);
requireEqual(
  "Количество benefit-карточек",
  countMatches(html, /<article class="card reveal">/g),
  EXPECTED_COUNTS.benefitCards,
);
requireEqual(
  "Количество trust items",
  countMatches(trustSection ?? "", /<span>/g),
  EXPECTED_COUNTS.trustItems,
);
requireEqual(
  "Количество dialog",
  countMatches(html, /<dialog\b/g),
  EXPECTED_COUNTS.dialogs,
);

const requiredSourceStrings = [
  "Эстетическая трихология для мастера",
  "Практический гайд по эстетической трихологии для барберов и парикмахеров: пилинги, шампуни, анализы, услуги и повышение среднего чека.",
  "ET",
  "Эстетическая трихология",
  "Что внутри",
  "Вопросы",
  "Выбрать формат",
  "Три формата обучения для мастеров по волосам",
  "Эстетическая трихология, которая усиливает экспертность и",
  "повышает чек мастера",
  "Как видеть состояние кожи головы, внедрить пилинг и scalp-care услуги, рекомендовать косметику и говорить про анализы корректно — без навязывания и медицинских обещаний.",
  "Цена запуска",
  "Что внутри гайда",
  "Практический гайд",
  "AI-ассистент в Telegram",
  "Личное сопровождение",
  "Внутри:",
  "пилинги, шампуни, анализы, пакеты услуг и готовые скрипты",
  "Для барберов",
  "Для парикмахеров",
  "Для мастеров по волосам",
  "Для салонов",
  "Почему это важно",
  "Клиент приходит не только за стрижкой. Он хочет понять, что происходит с его волосами.",
  "Сильнее консультация",
  "Точные вопросы, понятная оценка и персональные рекомендации.",
  "Новые услуги",
  "Пилинг, массаж кожи головы, ампулы и домашние наборы.",
  "Выше средний чек",
  "Дополнительные ритуалы продаются через пользу, а не через давление.",
  "Больше возвратов",
  "Клиент возвращается к мастеру, который помнит его запрос.",
  "Граница экспертности",
  "Не ставить диагноз. Уметь заметить, объяснить и вовремя направить к врачу.",
  "Гайд показывает, что мастер может делать безопасно, где заканчивается эстетический уход и когда клиенту нужен врач.",
  "Мини-консультация за 5–7 минут",
  "Красные флаги",
  "Как корректно говорить про анализы",
  "Не только теория — готовая база для внедрения услуги",
  "Основы трихологии",
  "Кожа головы, длина, частые жалобы и логика консультации.",
  "Пилинг и scalp-care",
  "Кому предлагать, протокол, ограничения и премиальная подача.",
  "Косметика и бренды",
  "Примеры пилингов, шампуней, сывороток и домашних схем.",
  "Анализы и врач",
  "Какие обследования клиент может обсудить с врачом.",
  "Деньги и продажи",
  "Пакеты услуг, цены в PLN, скрипты и расчёты роста чека.",
  "Пример расчёта",
  "Одна небольшая add-on услуга способна заметно изменить доход мастера",
  "2 клиента в день",
  "× 20 PLN",
  "× 20 рабочих дней",
  "+800 PLN / месяц",
  "«Трихология помогает мастеру продавать не услугу ради услуги, а понятное решение реального запроса клиента».",
  "Умная инвестиция",
  "Учитесь самостоятельно. Инвестируйте разницу в свой салон.",
  "Чтобы начать применять эстетическую трихологию, не обязательно сразу выбирать дорогое очное обучение. Получите структурированную базу, изучайте материал в удобном темпе, а разницу в стоимости формата направьте на инструменты, продукты или продвижение новой услуги.",
  "Начать самостоятельно за 79 PLN",
  "Посмотреть все форматы",
  "В удобном темпе",
  "Без поездок",
  "Доступ к материалу в любой момент",
  "Сравнение двух форматов обучения",
  "Очный курс в школе",
  "или",
  "Самостоятельный гайд",
  "Ваша экономия",
  "остаётся у вас",
  "Разницу можно направить на стартовую микрокамеру, профессиональные средства или продвижение новой услуги.",
  "Это сравнение стоимости двух разных форматов: очного курса и самостоятельного обучения по гайду. Их программы и состав могут отличаться.",
  "Выберите свой формат",
  "От самостоятельного обучения до личного внедрения со мной",
  "Во всех форматах вы получаете практическую основу. Выберите уровень поддержки, который поможет быстрее перейти от знаний к работе с клиентами.",
  "Самостоятельно",
  "Изучайте материал в своём темпе и внедряйте рекомендации самостоятельно.",
  "PDF-гайд на 26 страниц",
  "Продукты, анализы и протоколы",
  "Готовые услуги, цены и скрипты",
  "Доступ для личного использования",
  "Выбрать гайд",
  "Оптимальный выбор",
  "Гайд + AI-ассистент",
  "Практическое применение и быстрые ответы от AI-ассистента прямо в Telegram.",
  "Всё из тарифа «Практический гайд»",
  "Быстрые ответы по материалам гайда",
  "Поддержка при практическом применении",
  "Выбрать гайд + AI",
  "Помогает быстрее применять знания на практике",
  "Места ограничены",
  "Премиум-внедрение",
  "Личное сопровождение со мной по запуску и внедрению услуги в вашу работу.",
  "Практический PDF-гайд",
  "Личное сопровождение по запуску",
  "Помощь с внедрением под вашу практику",
  "Выбрать премиум",
  "Ограниченное количество мест",
  "Часто спрашивают",
  "Цифровой практический гайд.",
  "Публичная оферта",
  "Конфиденциальность",
  "Контакты",
  "Выбрать",
  "Выбранный формат",
  "Стоимость:",
  "Оплата по реквизитам",
  "Карта / счёт: УКАЖИТЕ РЕКВИЗИТЫ",
  "Получатель: УКАЖИТЕ ИМЯ",
  "Назначение платежа: Гайд по эстетической трихологии",
  "Копировать",
  "Скопировано",
  "После оплаты отправьте чек.",
  "После оплаты отправьте чек. Гайд придёт на указанную почту или в Telegram.",
  "Отправить чек в Telegram",
  "Отправить по email",
  "Здравствуйте! Я оплатила формат",
  "Оплата обучения по эстетической трихологии",
  "Публичная оферта — шаблон",
  "Перед публикацией замените реквизиты продавца и проверьте текст под вашу форму деятельности.",
  "Состав продукта зависит от выбранного формата и может включать PDF-гайд, доступ к AI-ассистенту в Telegram и личное сопровождение по внедрению. PDF предоставляется для личного использования. Копирование, перепродажа и передача материалов третьим лицам запрещены.",
  "Продавец: УКАЖИТЕ ИМЯ / СТАТУС / КОНТАКТЫ. Цена и порядок оплаты указаны на сайте.",
  "Политика конфиденциальности — шаблон",
  "Имя, email, Telegram и подтверждение оплаты используются только для обработки заказа, предоставления доступа и сопровождения в выбранном формате.",
  "Контакт для вопросов:",
];

for (const required of requiredSourceStrings) {
  requireIncludes("reference/index.html", html, required);
}

const requiredPrices = [
  "79 PLN",
  "100 PLN",
  "179 PLN",
  "249 PLN",
  "499 PLN",
  "599 PLN",
  "от 1 000 PLN",
  "до 921 PLN",
  "+800 PLN / месяц",
  "× 20 PLN",
];

for (const price of requiredPrices) {
  requireIncludes("Цена в reference/index.html", html, price);
}

const requiredAnchors = ["top", "inside", "plans", "faq"];
for (const anchor of requiredAnchors) {
  if (!new RegExp(`id=["']${anchor}["']`).test(html)) {
    failures.push(`Не найден публичный якорь #${anchor}`);
  }
}

const requiredCtaLabels = [
  "Выбрать формат",
  "Что внутри гайда",
  "Начать самостоятельно за 79 PLN",
  "Посмотреть все форматы",
  "Выбрать гайд",
  "Выбрать гайд + AI",
  "Выбрать премиум",
  "Публичная оферта",
  "Конфиденциальность",
  "Выбрать",
  "Отправить чек в Telegram",
  "Отправить по email",
];

for (const label of requiredCtaLabels) {
  requireIncludes("CTA в reference/index.html", html, label);
}

const faqQuestions = [
  "Это медицинское обучение?",
  "Подойдёт ли барберу?",
  "Как я получу гайд?",
  "Что даёт AI-ассистент?",
  "Что входит в премиум-внедрение?",
  "Можно ли распечатать?",
];

for (const question of faqQuestions) {
  requireIncludes("FAQ в reference/index.html", html, question);
}

const contentFileExpectations = {
  "src/content/site.ts": [
    "export const siteMetadata",
    "export const publicAnchorIds",
    "export const headerContent",
    "export const footerContent",
    "export const stickyPurchaseBarContent",
    "export const siteConfig",
  ],
  "src/content/home.ts": [
    "export const heroContent",
    "export const trustBarContent",
    "export const benefitsContent",
    "export const expertiseBoundaryContent",
    "export const guideContentsContent",
    "export const incomeCalculationContent",
    "export const quoteContent",
    "export const investmentContent",
    "export const pricingIntroContent",
    "export const faqIntroContent",
    "export const homeSectionOrder",
    "export const homeContent",
  ],
  "src/content/plans.ts": ["export const plans"],
  "src/content/faq.ts": ["export const faqItems"],
  "src/content/legal.ts": [
    "export const legalDocuments",
    "export const legalDialogContent",
  ],
  "src/content/purchase.ts": [
    "export const paymentDetailDefinitions",
    "export const purchaseDialogContent",
  ],
  "src/content/images.ts": ["export const siteImages"],
  "src/lib/purchase-message.ts": ["export function createPurchaseMessage"],
};

const contentSources = [];
for (const [relativePath, exports] of Object.entries(contentFileExpectations)) {
  const source = readFileSync(resolve(projectRoot, relativePath), "utf8");
  contentSources.push(source);

  for (const expectedExport of exports) {
    requireIncludes(relativePath, source, expectedExport);
  }
}

const combinedContent = contentSources.join("\n");
const requiredTypedContentStrings = requiredSourceStrings.filter(
  (value) =>
    !value.includes("УКАЖИТЕ") &&
    value !== "Эстетическая трихология, которая усиливает экспертность и" &&
    value !== "Карта / счёт: УКАЖИТЕ РЕКВИЗИТЫ" &&
    value !== "Получатель: УКАЖИТЕ ИМЯ" &&
    value !== "Назначение платежа: Гайд по эстетической трихологии" &&
    value !==
      "Продавец: УКАЖИТЕ ИМЯ / СТАТУС / КОНТАКТЫ. Цена и порядок оплаты указаны на сайте.",
);

for (const required of requiredTypedContentStrings) {
  requireIncludes("Типизированный контент", combinedContent, required);
}

for (const forbiddenPlaceholder of [
  "YOUR_TELEGRAM",
  "your@email.com",
  "УКАЖИТЕ РЕКВИЗИТЫ",
  "УКАЖИТЕ ИМЯ",
]) {
  if (combinedContent.includes(forbiddenPlaceholder)) {
    failures.push(
      `Рабочий TypeScript-контент содержит исходную заглушку ${JSON.stringify(forbiddenPlaceholder)}`,
    );
  }
}

const plansSource = readFileSync(
  resolve(projectRoot, "src/content/plans.ts"),
  "utf8",
);
requireEqual(
  "Типизированные тарифы",
  countMatches(plansSource, /\bid: "(?:guide|ai|premium)"/g),
  3,
);
for (const numericPrice of [79, 100, 179, 249, 499, 599]) {
  if (
    !new RegExp(`(?:price|oldPrice): ${numericPrice}(?:,|\\n)`).test(
      plansSource,
    )
  ) {
    failures.push(`В plans.ts отсутствует числовая цена ${numericPrice}`);
  }
}

const faqSource = readFileSync(
  resolve(projectRoot, "src/content/faq.ts"),
  "utf8",
);
requireEqual(
  "Типизированные FAQ",
  countMatches(
    faqSource,
    /\bid: "(?:medical|barber|delivery|ai-assistant|premium|printing)"/g,
  ),
  6,
);

const legalSource = readFileSync(
  resolve(projectRoot, "src/content/legal.ts"),
  "utf8",
);
requireEqual(
  "Типизированные legal documents",
  countMatches(legalSource, /\bid: "(?:offer|privacy)"/g),
  2,
);
requireIncludes("Dynamic seller block", legalSource, 'type: "seller-details"');
requireIncludes(
  "Dynamic privacy contact block",
  legalSource,
  'type: "privacy-contact"',
);

if (failures.length > 0) {
  console.error("Проверка контента завершилась с ошибками:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`HTML SHA-256: ${htmlSha256}`);
  console.log(`Секции: ${EXPECTED_COUNTS.sections}`);
  console.log(`Тарифы: ${EXPECTED_COUNTS.plans}`);
  console.log(`FAQ: ${EXPECTED_COUNTS.faq}`);
  console.log(`Модули гайда: ${EXPECTED_COUNTS.guideModules}`);
  console.log(`Benefit cards: ${EXPECTED_COUNTS.benefitCards}`);
  console.log(`Trust items: ${EXPECTED_COUNTS.trustItems}`);
  console.log(`Dialog: ${EXPECTED_COUNTS.dialogs}`);
  console.log(`Обязательных исходных строк: ${requiredSourceStrings.length}`);
  console.log(
    "Типизированные content-модули и структурные преобразования подтверждены.",
  );
}
