import { NextResponse } from "next/server";

import { plans } from "@/content/plans";
import { env } from "@/lib/env";
import {
  DIGITAL_DELIVERY_CONSENT_SCOPE,
  DIGITAL_DELIVERY_CONSENT_TEXT,
  DIGITAL_DELIVERY_CONSENT_VERSION,
  isValidDigitalDeliveryConsent,
} from "@/lib/digital-delivery-consent";
import { getStripeClient, getStripePriceId } from "@/lib/stripe";
import type { PlanId } from "@/types/plan";

export const runtime = "nodejs";

function findPlan(planId: unknown) {
  if (typeof planId !== "string") {
    return undefined;
  }

  return plans.find((plan) => plan.id === (planId as PlanId));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => undefined);
  const plan = findPlan(body?.planId);

  if (!plan) {
    return NextResponse.json({ error: "Неизвестный тариф." }, { status: 400 });
  }

  const stripe = getStripeClient();
  const priceId = getStripePriceId(plan.id);

  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: "Оплата через Stripe пока не настроена." },
      { status: 503 },
    );
  }

  if (!isValidDigitalDeliveryConsent(body?.digitalDeliveryConsent)) {
    return NextResponse.json(
      {
        error:
          "Для немедленной выдачи PDF необходимо отдельное явное согласие.",
      },
      { status: 400 },
    );
  }

  const consentAcceptedAt = new Date().toISOString();
  const consentMetadata = {
    digitalDeliveryConsent: "accepted",
    digitalDeliveryConsentText: DIGITAL_DELIVERY_CONSENT_TEXT,
    digitalDeliveryConsentVersion: DIGITAL_DELIVERY_CONSENT_VERSION,
    digitalDeliveryConsentAcceptedAt: consentAcceptedAt,
    digitalDeliveryConsentScope: DIGITAL_DELIVERY_CONSENT_SCOPE,
  };
  const confirmationDescription = [
    `Покупка: ${plan.name}.`,
    DIGITAL_DELIVERY_CONSENT_TEXT,
    `Согласие зафиксировано: ${consentAcceptedAt}.`,
    `Версия: ${DIGITAL_DELIVERY_CONSENT_VERSION}.`,
  ].join(" ");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: "auto",
      metadata: { planId: plan.id, ...consentMetadata },
      payment_intent_data: {
        description: confirmationDescription,
        metadata: { planId: plan.id, ...consentMetadata },
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: confirmationDescription,
          footer:
            "Подтверждение заказа и согласия на немедленную выдачу PDF. Права на рекламацию сохраняются.",
          metadata: { planId: plan.id, ...consentMetadata },
        },
      },
      success_url: new URL(
        "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
        env.siteUrl,
      ).toString(),
      cancel_url: new URL("/#pricing", env.siteUrl).toString(),
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Session creation failed", error);

    return NextResponse.json(
      { error: "Не удалось открыть страницу оплаты." },
      { status: 502 },
    );
  }
}
