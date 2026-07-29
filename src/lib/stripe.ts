import "server-only";

import Stripe from "stripe";

import type { PlanId } from "@/types/plan";

const stripePriceEnvironment = {
  guide: process.env.STRIPE_PRICE_GUIDE,
  ai: process.env.STRIPE_PRICE_AI,
  premium: process.env.STRIPE_PRICE_PREMIUM,
} as const satisfies Record<PlanId, string | undefined>;

function readOptionalValue(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : undefined;
}

const secretKey = readOptionalValue(process.env.STRIPE_SECRET_KEY);
const webhookSecret = readOptionalValue(process.env.STRIPE_WEBHOOK_SECRET);
const priceIds = Object.fromEntries(
  Object.entries(stripePriceEnvironment).map(([planId, priceId]) => [
    planId,
    readOptionalValue(priceId),
  ]),
) as Record<PlanId, string | undefined>;

let stripeClient: Stripe | undefined;

export const isStripeCheckoutReady =
  Boolean(secretKey) && Object.values(priceIds).every(Boolean);

export function getStripePriceId(planId: PlanId): string | undefined {
  return priceIds[planId];
}

export function getStripeWebhookSecret(): string | undefined {
  return webhookSecret;
}

export function getStripeClient(): Stripe | undefined {
  if (!secretKey) {
    return undefined;
  }

  stripeClient ??= new Stripe(secretKey, {
    appInfo: {
      name: "trichology-landing",
      version: "0.1.0",
    },
  });

  return stripeClient;
}
