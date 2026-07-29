import type {
  FooterContent,
  HeaderContent,
  PublicAnchorIds,
  SiteConfiguration,
  SiteMetadataContent,
  StickyPurchaseBarContent,
} from "@/types/site";

export const siteMetadata = {
  title: "Эстетическая трихология для мастера",
  description:
    "Практический гайд по эстетической трихологии для барберов и парикмахеров: пилинги, шампуни, анализы, услуги и повышение среднего чека.",
} as const satisfies SiteMetadataContent;

export const publicAnchorIds = {
  top: "top",
  inside: "inside",
  plans: "plans",
  faq: "faq",
} as const satisfies PublicAnchorIds;

export const headerContent = {
  brand: {
    mark: "ET",
    name: "Эстетическая трихология",
    href: "#top",
  },
  navigation: [
    { label: "Что внутри", href: "#inside" },
    { label: "Вопросы", href: "#faq" },
  ],
  cta: { label: "Выбрать формат", href: "#plans" },
} as const satisfies HeaderContent;

export const footerContent = {
  title: "Эстетическая трихология для мастера",
  description: "Цифровой практический гайд.",
  legalTriggers: [
    { documentId: "offer", label: "Публичная оферта" },
    { documentId: "privacy", label: "Конфиденциальность" },
  ],
  contact: { label: "Контакты", type: "email" },
} as const satisfies FooterContent;

export const stickyPurchaseBarContent = {
  price: {
    prefix: "от",
    price: 79,
    oldPrice: 100,
    currency: "PLN",
  },
  cta: { label: "Выбрать", href: "#plans" },
} as const satisfies StickyPurchaseBarContent;

export const siteConfig = {
  metadata: siteMetadata,
  header: headerContent,
  footer: footerContent,
  stickyPurchaseBar: stickyPurchaseBarContent,
  anchors: publicAnchorIds,
  currency: "PLN",
  launchNote: "Цена запуска",
} as const satisfies SiteConfiguration;
