import type { SiteImageId } from "@/types/image";
import type { CurrencyCode, PlanId } from "@/types/plan";
import type { PublicAnchorHref } from "@/types/site";

export type HomeSectionId =
  | "hero"
  | "trust"
  | "benefits"
  | "expertise"
  | "inside"
  | "income"
  | "quote"
  | "investment"
  | "plans"
  | "faq";

export interface EyebrowContent {
  text: string;
}

export interface EmphasizedHeading {
  before: string;
  emphasis: string;
  after?: string;
}

export interface PriceDisplay {
  prefix?: string;
  price: number;
  oldPrice?: number;
  currency: CurrencyCode;
  badge?: string;
}

export interface AnchorAction {
  label: string;
  href: PublicAnchorHref;
}

export interface PlanPurchaseAction {
  label: string;
  planId: PlanId;
}

export interface FloatingCardContent {
  title: string;
  text: string;
}

export interface HeroContent {
  id: "hero";
  eyebrow: EyebrowContent;
  heading: EmphasizedHeading;
  lead: string;
  price: PriceDisplay;
  primaryAction: AnchorAction;
  secondaryAction: AnchorAction;
  highlights: readonly string[];
  imageId: SiteImageId;
  floatingCard: FloatingCardContent;
}

export interface TrustBarContent {
  id: "trust";
  items: readonly string[];
}

export interface ContentCard {
  number: string;
  title: string;
  description: string;
}

export interface BenefitsContent {
  id: "benefits";
  eyebrow: EyebrowContent;
  heading: string;
  cards: readonly ContentCard[];
}

export interface ExpertiseChecklistItem {
  title: string;
}

export interface ExpertiseBoundaryContent {
  id: "expertise";
  imageId: SiteImageId;
  eyebrow: EyebrowContent;
  heading: string;
  description: string;
  checklist: readonly ExpertiseChecklistItem[];
}

export interface GuideModule {
  number: string;
  title: string;
  description: string;
}

export interface GuideContentsContent {
  id: "inside";
  anchorId: "inside";
  eyebrow: EyebrowContent;
  heading: string;
  modules: readonly GuideModule[];
}

export interface CalculationRow {
  label: string;
  value: string;
}

export interface IncomeCalculationContent {
  id: "income";
  eyebrow: EyebrowContent;
  heading: string;
  rows: readonly CalculationRow[];
  result: string;
  values: {
    clientsPerDay: number;
    addonPrice: number;
    workingDays: number;
    monthlyResult: number;
    currency: CurrencyCode;
  };
}

export interface QuoteContent {
  id: "quote";
  text: string;
}

export interface InvestmentPoint {
  text: string;
}

export interface ComparisonFormat {
  label: string;
  price: number;
  currency: CurrencyCode;
  pricePrefix?: string;
  crossedOut?: boolean;
}

export interface SavingsDisplay {
  label: string;
  amountPrefix: string;
  amount: number;
  currency: CurrencyCode;
  suffix: string;
}

export interface InvestmentComparison {
  title: string;
  formats: readonly [ComparisonFormat, ComparisonFormat];
  separator: string;
  savings: SavingsDisplay;
  explanation: string;
  note: string;
}

export interface InvestmentContent {
  id: "investment";
  eyebrow: EyebrowContent;
  heading: string;
  description: string;
  purchaseAction: PlanPurchaseAction;
  plansLink: AnchorAction;
  points: readonly InvestmentPoint[];
  comparison: InvestmentComparison;
}

export interface PricingIntroContent {
  id: "plans";
  anchorId: "plans";
  eyebrow: EyebrowContent;
  heading: string;
  description: string;
}

export interface FaqIntroContent {
  id: "faq";
  anchorId: "faq";
  eyebrow: EyebrowContent;
  heading: string;
}

export interface HomeContent {
  sectionOrder: readonly [
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
  ];
  hero: HeroContent;
  trust: TrustBarContent;
  benefits: BenefitsContent;
  expertise: ExpertiseBoundaryContent;
  inside: GuideContentsContent;
  income: IncomeCalculationContent;
  quote: QuoteContent;
  investment: InvestmentContent;
  plans: PricingIntroContent;
  faq: FaqIntroContent;
}
