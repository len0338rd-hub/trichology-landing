"use client";

import { useEffect, useRef, useState } from "react";

import { purchaseDialogContent } from "@/content/purchase";
import type { PaymentDetailId } from "@/types/purchase";

interface PaymentDetailRowProps {
  id: PaymentDetailId;
  label: string;
  value: string;
}

type CopyStatus = "idle" | "copied" | "error";

export function PaymentDetailRow({ id, label, value }: PaymentDetailRowProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const normalizedValue = value.trim();
  const isAvailable = normalizedValue.length > 0;
  const displayedValue = isAvailable
    ? normalizedValue
    : purchaseDialogContent.missingValueLabel;
  const buttonLabel =
    copyStatus === "copied"
      ? purchaseDialogContent.copiedLabel
      : copyStatus === "error"
        ? purchaseDialogContent.copyErrorLabel
        : purchaseDialogContent.copyLabel;

  useEffect(
    () => () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  async function copyValue() {
    if (!isAvailable) {
      return;
    }

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    try {
      await navigator.clipboard.writeText(normalizedValue);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    resetTimerRef.current = setTimeout(() => {
      setCopyStatus("idle");
      resetTimerRef.current = null;
    }, purchaseDialogContent.copyFeedbackDurationMs);
  }

  return (
    <div
      className="flex items-start justify-between gap-4 max-[621px]:flex-col max-[621px]:gap-2"
      data-payment-detail={id}
    >
      <span className="min-w-0 break-words">
        <strong>{label}:</strong> {displayedValue}
      </span>
      <button
        className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-extrabold text-accent disabled:cursor-not-allowed disabled:opacity-45"
        disabled={!isAvailable}
        onClick={copyValue}
        type="button"
      >
        {buttonLabel}
      </button>
      <span aria-live="polite" className="sr-only" role="status">
        {copyStatus === "copied"
          ? purchaseDialogContent.copiedLabel
          : copyStatus === "error"
            ? purchaseDialogContent.copyErrorLabel
            : ""}
      </span>
    </div>
  );
}
