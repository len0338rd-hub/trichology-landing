import type {
  BenefitsContent,
  ExpertiseBoundaryContent,
  FaqIntroContent,
  GuideContentsContent,
  HeroContent,
  HomeContent,
  HomeSectionId,
  IncomeCalculationContent,
  InvestmentContent,
  PricingIntroContent,
  QuoteContent,
  TrustBarContent,
} from "@/types/content";

export const heroContent = {
  id: "hero",
  eyebrow: { text: "Три формата обучения для мастеров по волосам" },
  heading: {
    before: "Эстетическая трихология, которая усиливает экспертность и ",
    emphasis: "повышает чек мастера",
  },
  lead: "Как видеть состояние кожи головы, внедрить пилинг и scalp-care услуги, рекомендовать косметику и говорить про анализы корректно — без навязывания и медицинских обещаний.",
  price: {
    prefix: "от",
    price: 79,
    oldPrice: 100,
    currency: "PLN",
    badge: "Цена запуска",
  },
  primaryAction: { label: "Выбрать формат", href: "#plans" },
  secondaryAction: { label: "Что внутри гайда", href: "#inside" },
  highlights: [
    "Практический гайд",
    "AI-ассистент в Telegram",
    "Личное сопровождение",
  ],
  imageId: "heroConsultation",
  floatingCard: {
    title: "Внутри:",
    text: "пилинги, шампуни, анализы, пакеты услуг и готовые скрипты",
  },
} as const satisfies HeroContent;

export const trustBarContent = {
  id: "trust",
  items: [
    "Для барберов",
    "Для парикмахеров",
    "Для мастеров по волосам",
    "Для салонов",
  ],
} as const satisfies TrustBarContent;

export const benefitsContent = {
  id: "benefits",
  eyebrow: { text: "Почему это важно" },
  heading:
    "Клиент приходит не только за стрижкой. Он хочет понять, что происходит с его волосами.",
  cards: [
    {
      number: "01",
      title: "Сильнее консультация",
      description:
        "Точные вопросы, понятная оценка и персональные рекомендации.",
    },
    {
      number: "02",
      title: "Новые услуги",
      description: "Пилинг, массаж кожи головы, ампулы и домашние наборы.",
    },
    {
      number: "03",
      title: "Выше средний чек",
      description:
        "Дополнительные ритуалы продаются через пользу, а не через давление.",
    },
    {
      number: "04",
      title: "Больше возвратов",
      description: "Клиент возвращается к мастеру, который помнит его запрос.",
    },
  ],
} as const satisfies BenefitsContent;

export const expertiseBoundaryContent = {
  id: "expertise",
  imageId: "scalpDiagnostics",
  eyebrow: { text: "Граница экспертности" },
  heading:
    "Не ставить диагноз. Уметь заметить, объяснить и вовремя направить к врачу.",
  description:
    "Гайд показывает, что мастер может делать безопасно, где заканчивается эстетический уход и когда клиенту нужен врач.",
  checklist: [
    { title: "Мини-консультация за 5–7 минут" },
    { title: "Красные флаги" },
    { title: "Как корректно говорить про анализы" },
  ],
} as const satisfies ExpertiseBoundaryContent;

export const guideContentsContent = {
  id: "inside",
  anchorId: "inside",
  eyebrow: { text: "Что внутри гайда" },
  heading: "Не только теория — готовая база для внедрения услуги",
  modules: [
    {
      number: "01",
      title: "Основы трихологии",
      description: "Кожа головы, длина, частые жалобы и логика консультации.",
    },
    {
      number: "02",
      title: "Пилинг и scalp-care",
      description:
        "Кому предлагать, протокол, ограничения и премиальная подача.",
    },
    {
      number: "03",
      title: "Косметика и бренды",
      description: "Примеры пилингов, шампуней, сывороток и домашних схем.",
    },
    {
      number: "04",
      title: "Анализы и врач",
      description: "Какие обследования клиент может обсудить с врачом.",
    },
    {
      number: "05",
      title: "Деньги и продажи",
      description: "Пакеты услуг, цены в PLN, скрипты и расчёты роста чека.",
    },
  ],
} as const satisfies GuideContentsContent;

export const incomeCalculationContent = {
  id: "income",
  eyebrow: { text: "Пример расчёта" },
  heading:
    "Одна небольшая add-on услуга способна заметно изменить доход мастера",
  rows: [
    { label: "2 клиента в день", value: "× 80 PLN" },
    { label: "× 20 рабочих дней", value: "+3 200 PLN / месяц" },
  ],
  result: "+3 200 PLN / месяц",
  values: {
    clientsPerDay: 2,
    addonPrice: 80,
    workingDays: 20,
    monthlyResult: 3200,
    currency: "PLN",
  },
} as const satisfies IncomeCalculationContent;

export const quoteContent = {
  id: "quote",
  text: "«Трихология помогает мастеру продавать не услугу ради услуги, а понятное решение реального запроса клиента».",
} as const satisfies QuoteContent;

export const investmentContent = {
  id: "investment",
  eyebrow: { text: "Умная инвестиция" },
  heading: "Учитесь самостоятельно. Инвестируйте разницу в свой салон.",
  description:
    "Чтобы начать применять эстетическую трихологию, не обязательно сразу выбирать дорогое очное обучение. Получите структурированную базу, изучайте материал в удобном темпе, а разницу в стоимости формата направьте на инструменты, продукты или продвижение новой услуги.",
  purchaseAction: {
    label: "Начать самостоятельно за 79 PLN",
    planId: "guide",
  },
  plansLink: { label: "Посмотреть все форматы", href: "#plans" },
  points: [
    { text: "В удобном темпе" },
    { text: "Без поездок" },
    { text: "Доступ к материалу в любой момент" },
  ],
  comparison: {
    title: "Сравнение двух форматов обучения",
    formats: [
      {
        label: "Очный курс в школе",
        pricePrefix: "от",
        price: 1000,
        currency: "PLN",
        crossedOut: true,
      },
      {
        label: "Самостоятельный гайд",
        price: 79,
        currency: "PLN",
      },
    ],
    separator: "или",
    savings: {
      label: "Ваша экономия",
      amountPrefix: "до",
      amount: 921,
      currency: "PLN",
      suffix: "остаётся у вас",
    },
    explanation:
      "Разницу можно направить на стартовую микрокамеру, профессиональные средства или продвижение новой услуги.",
    note: "Это сравнение стоимости двух разных форматов: очного курса и самостоятельного обучения по гайду. Их программы и состав могут отличаться.",
  },
} as const satisfies InvestmentContent;

export const pricingIntroContent = {
  id: "plans",
  anchorId: "plans",
  eyebrow: { text: "Выберите свой формат" },
  heading: "От самостоятельного обучения до личного внедрения со мной",
  description:
    "Во всех форматах вы получаете практическую основу. Выберите уровень поддержки, который поможет быстрее перейти от знаний к работе с клиентами.",
} as const satisfies PricingIntroContent;

export const faqIntroContent = {
  id: "faq",
  anchorId: "faq",
  eyebrow: { text: "Вопросы" },
  heading: "Часто спрашивают",
} as const satisfies FaqIntroContent;

export const homeSectionOrder = [
  "hero",
  "trust",
  "benefits",
  "expertise",
  "inside",
  "income",
  "quote",
  "investment",
  "plans",
  "faq",
] as const satisfies readonly HomeSectionId[];

export const homeContent = {
  sectionOrder: homeSectionOrder,
  hero: heroContent,
  trust: trustBarContent,
  benefits: benefitsContent,
  expertise: expertiseBoundaryContent,
  inside: guideContentsContent,
  income: incomeCalculationContent,
  quote: quoteContent,
  investment: investmentContent,
  plans: pricingIntroContent,
  faq: faqIntroContent,
} as const satisfies HomeContent;
