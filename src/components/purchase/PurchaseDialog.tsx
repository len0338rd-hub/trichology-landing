"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from "react";

import { PaymentDetailRow } from "@/components/purchase/PaymentDetailRow";
import { usePurchase } from "@/components/purchase/PurchaseProvider";
import { StripeCheckoutButton } from "@/components/purchase/StripeCheckoutButton";
import { getButtonClassName } from "@/components/ui/Button";
import { formatPrice } from "@/components/ui/PriceDisplay";
import {
  paymentDetailDefinitions,
  purchaseDialogContent,
} from "@/content/purchase";
import {
  createEmailPurchaseUrl,
  createTelegramPurchaseUrl,
} from "@/lib/purchase-links";
import { DIGITAL_DELIVERY_CONSENT_TEXT } from "@/lib/digital-delivery-consent";
import type {
  PaymentEnvironmentKey,
  PurchaseConfiguration,
} from "@/types/purchase";

const PURCHASE_DIALOG_TITLE_ID = "purchase-dialog-title";

function getPaymentValue(
  configuration: PurchaseConfiguration,
  envKey: PaymentEnvironmentKey,
): string {
  switch (envKey) {
    case "NEXT_PUBLIC_PAYMENT_ACCOUNT":
      return configuration.paymentAccount;
    case "NEXT_PUBLIC_PAYMENT_RECIPIENT":
      return configuration.paymentRecipient;
    case "NEXT_PUBLIC_PAYMENT_PURPOSE":
      return configuration.paymentPurpose;
  }
}

export function PurchaseDialog() {
  const { closePurchase, configuration, isPurchaseDialogOpen, selectedPlan } =
    usePurchase();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [digitalDeliveryConsentAccepted, setDigitalDeliveryConsentAccepted] =
    useState(false);
  const messageInput = {
    planName: selectedPlan.name,
    price: selectedPlan.price,
    currency: selectedPlan.currency,
    digitalDeliveryConsentText: DIGITAL_DELIVERY_CONSENT_TEXT,
  } as const;
  const telegramUrl = createTelegramPurchaseUrl({
    ...messageInput,
    telegramUsername: configuration.telegramUsername,
  });
  const emailUrl = createEmailPurchaseUrl({
    ...messageInput,
    contactEmail: configuration.contactEmail,
    subject: purchaseDialogContent.emailSubject,
  });

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isPurchaseDialogOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!isPurchaseDialogOpen && dialog.open) {
      dialog.close();
    }
  }, [isPurchaseDialogOpen]);

  function closeDialog() {
    setDigitalDeliveryConsentAccepted(false);
    closePurchase();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeDialog();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const dialog = event.currentTarget;
    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("aria-disabled"));
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements.at(-1);

    if (!firstFocusableElement || !lastFocusableElement) {
      return;
    }

    if (event.shiftKey && document.activeElement === firstFocusableElement) {
      event.preventDefault();
      lastFocusableElement.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === lastFocusableElement
    ) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }

  return (
    <dialog
      aria-labelledby={PURCHASE_DIALOG_TITLE_ID}
      className="purchase-dialog"
      id="buyDialog"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onClose={() => {
        if (isPurchaseDialogOpen) {
          closeDialog();
        }
      }}
      onKeyDown={handleDialogKeyDown}
      ref={dialogRef}
    >
      <div className="purchase-dialog__content">
        <button
          aria-label={purchaseDialogContent.closeButtonAriaLabel}
          className="purchase-dialog__close"
          onClick={closeDialog}
          ref={closeButtonRef}
          type="button"
        >
          {purchaseDialogContent.closeButtonText}
        </button>
        <div className="mb-5 text-xs leading-[1.5] font-extrabold tracking-[0.15em] text-accent uppercase">
          {purchaseDialogContent.eyebrow}
        </div>
        <h2
          className="mt-0 mb-1.5 pr-10 font-serif text-[32px] leading-[1.08] font-medium max-[621px]:text-[28px]"
          id={PURCHASE_DIALOG_TITLE_ID}
        >
          {selectedPlan.name}
        </h2>
        <p className="mt-0 mb-4 text-xl">
          {purchaseDialogContent.priceLabel}{" "}
          <strong className="text-[28px]" data-testid="purchase-current-price">
            {formatPrice(selectedPlan.price, selectedPlan.currency)}
          </strong>{" "}
          <s className="ml-2 text-[#998f89]" data-testid="purchase-old-price">
            {formatPrice(selectedPlan.oldPrice, selectedPlan.currency)}
          </s>
        </p>
        <p className="mt-0 mb-4 text-sm text-muted">
          Перед оплатой ознакомьтесь с условиями в разделе{" "}
          <a className="font-bold text-accent" href="/purchase-policy">
            «Покупка и возврат»
          </a>
          .
        </p>
        <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-soft p-4 text-sm leading-relaxed">
          <input
            checked={digitalDeliveryConsentAccepted}
            className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            data-testid="digital-delivery-consent"
            onChange={(event) =>
              setDigitalDeliveryConsentAccepted(event.target.checked)
            }
            type="checkbox"
          />
          <span>
            {DIGITAL_DELIVERY_CONSENT_TEXT}{" "}
            <a
              className="font-bold text-accent"
              href="/purchase-policy#digital-content"
            >
              Подробнее об отказе и возврате.
            </a>
          </span>
        </label>
        <div className="mb-5 rounded-2xl border border-border p-[18px]">
          <StripeCheckoutButton
            digitalDeliveryConsentAccepted={digitalDeliveryConsentAccepted}
            planId={selectedPlan.id}
            ready={configuration.stripeCheckoutReady}
          />
          <p className="mt-3 mb-0 text-sm text-muted">
            Безопасная оплата картой и доступными способами на странице Stripe.
          </p>
        </div>
        <p className="my-0">
          <strong>{purchaseDialogContent.paymentTitle}</strong>
        </p>
        <div
          className="my-[18px] grid gap-[9px] rounded-2xl bg-soft p-[18px]"
          id="paymentDetails"
        >
          {paymentDetailDefinitions.map((definition) => (
            <PaymentDetailRow
              id={definition.id}
              key={definition.id}
              label={definition.label}
              value={getPaymentValue(configuration, definition.envKey)}
            />
          ))}
        </div>
        <p className="text-muted">{purchaseDialogContent.deliveryText}</p>
        <div className="flex flex-wrap gap-3 max-[621px]:[&>*]:w-full">
          {telegramUrl && digitalDeliveryConsentAccepted ? (
            <a
              className={getButtonClassName({})}
              data-testid="telegram-purchase-link"
              href={telegramUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {purchaseDialogContent.telegramCtaLabel}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className={getButtonClassName({
                className: "cursor-not-allowed opacity-50",
              })}
              data-testid="telegram-purchase-fallback"
            >
              {purchaseDialogContent.telegramCtaLabel}
            </span>
          )}
          {emailUrl && digitalDeliveryConsentAccepted ? (
            <a
              className={getButtonClassName({ variant: "ghost" })}
              data-testid="email-purchase-link"
              href={emailUrl}
            >
              {purchaseDialogContent.emailCtaLabel}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className={getButtonClassName({
                className: "cursor-not-allowed opacity-50",
                variant: "ghost",
              })}
              data-testid="email-purchase-fallback"
            >
              {purchaseDialogContent.emailCtaLabel}
            </span>
          )}
        </div>
      </div>
    </dialog>
  );
}
