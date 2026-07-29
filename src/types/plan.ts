export type PlanId = "guide" | "ai" | "premium";

export type CurrencyCode = "PLN";

export interface Plan {
  id: PlanId;
  label: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  currency: CurrencyCode;
  features: readonly string[];
  ctaLabel: string;
  note?: string;
  featured?: boolean;
}
