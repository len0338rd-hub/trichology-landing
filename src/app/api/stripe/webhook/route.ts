import Stripe from "stripe";

import { recordPaidCheckoutSession } from "@/lib/stripe-fulfillment";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

const paidCheckoutEvents = new Set<Stripe.Event.Type>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = getStripeWebhookSecret();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return new Response("Stripe webhook is not configured", { status: 503 });
  }

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  if (paidCheckoutEvents.has(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await recordPaidCheckoutSession(session.id);
    } catch (error) {
      console.error("Stripe checkout processing failed", error);
      return new Response("Checkout processing failed", { status: 500 });
    }
  }

  return Response.json({ received: true });
}
