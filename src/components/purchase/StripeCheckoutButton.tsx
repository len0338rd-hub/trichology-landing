"use client";

import { useState } from "react";

import { getButtonClassName } from "@/components/ui/Button";
import { purchaseDialogContent } from "@/content/purchase";
import { DIGITAL_DELIVERY_CONSENT_VERSION } from "@/lib/digital-delivery-consent";
import type { PlanId } from "@/types/plan";

interface StripeCheckoutButtonProps {
  planId: PlanId;
  ready: boolean;
  digitalDeliveryConsentAccepted: boolean;
}

export function StripeCheckoutButton({
  planId,
  ready,
  digitalDeliveryConsentAccepted,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function openStripeCheckout() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          digitalDeliveryConsent: {
            accepted: digitalDeliveryConsentAccepted,
            version: DIGITAL_DELIVERY_CONSENT_VERSION,
          },
        }),
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error);
      }

      window.location.assign(result.url);
    } catch {
      setErrorMessage(purchaseDialogContent.stripeErrorMessage);
      setIsLoading(false);
    }
  }

  const label = !ready
    ? purchaseDialogContent.stripeUnavailableLabel
    : isLoading
      ? purchaseDialogContent.stripeLoadingLabel
      : !digitalDeliveryConsentAccepted
        ? purchaseDialogContent.stripeConsentRequiredLabel
        : purchaseDialogContent.stripeCtaLabel;

  return (
    <div>
      <button
        className={getButtonClassName({ fullWidth: true })}
        data-testid="stripe-checkout-button"
        disabled={!ready || isLoading || !digitalDeliveryConsentAccepted}
        onClick={openStripeCheckout}
        type="button"
      >
        {label}
      </button>
      {errorMessage ? (
        <p
          aria-live="polite"
          className="mt-2 mb-0 text-sm text-[#9b2c2c]"
          role="status"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
