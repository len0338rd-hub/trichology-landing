import "server-only";

import { getStripeClient } from "@/lib/stripe";

export async function recordPaidCheckoutSession(
  sessionId: string,
): Promise<void> {
  const stripe = getStripeClient();

  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    return;
  }

  const immediateDigitalDeliveryAuthorized =
    session.metadata?.digitalDeliveryConsent === "accepted" &&
    Boolean(session.metadata?.digitalDeliveryConsentAcceptedAt) &&
    Boolean(session.metadata?.digitalDeliveryConsentVersion);

  // This structured server log is the integration point for email/PDF access.
  // Replace it with an idempotent order write before enabling automatic delivery.
  console.info("Stripe checkout paid", {
    sessionId: session.id,
    customerEmail: session.customer_details?.email,
    planId: session.metadata?.planId,
    amountTotal: session.amount_total,
    currency: session.currency,
    immediateDigitalDeliveryAuthorized,
    digitalDeliveryConsentAcceptedAt:
      session.metadata?.digitalDeliveryConsentAcceptedAt,
    digitalDeliveryConsentVersion:
      session.metadata?.digitalDeliveryConsentVersion,
  });
}
