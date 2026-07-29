import type { CurrencyCode, PlanId } from "@/types/plan";

export type PaymentDetailId = "account" | "recipient" | "purpose";

export type PaymentEnvironmentKey =
  | "NEXT_PUBLIC_PAYMENT_ACCOUNT"
  | "NEXT_PUBLIC_PAYMENT_RECIPIENT"
  | "NEXT_PUBLIC_PAYMENT_PURPOSE";

export interface PaymentDetailDefinition {
  id: PaymentDetailId;
  label: string;
  envKey: PaymentEnvironmentKey;
}

export interface PurchaseMessageTemplate {
  greeting: string;
  formatOpening: string;
  formatClosing: string;
  priceSeparator: string;
  closing: string;
}

export interface PurchaseMessageInput {
  planName: string;
  price: number;
  currency: CurrencyCode;
  digitalDeliveryConsentText?: string;
}

export interface PurchaseDialogContent {
  closeButtonText: string;
  closeButtonAriaLabel: string;
  eyebrow: string;
  priceLabel: string;
  paymentTitle: string;
  copyLabel: string;
  copiedLabel: string;
  copyErrorLabel: string;
  missingValueLabel: string;
  copyFeedbackDurationMs: number;
  deliveryFallbackText: string;
  deliveryText: string;
  telegramCtaLabel: string;
  emailCtaLabel: string;
  emailSubject: string;
  stripeCtaLabel: string;
  stripeLoadingLabel: string;
  stripeUnavailableLabel: string;
  stripeConsentRequiredLabel: string;
  stripeErrorMessage: string;
  fallbackPlanId: PlanId;
  messageTemplate: PurchaseMessageTemplate;
}

export interface PurchaseConfiguration {
  telegramUsername: string;
  contactEmail: string;
  paymentAccount: string;
  paymentRecipient: string;
  paymentPurpose: string;
  stripeCheckoutReady: boolean;
}
