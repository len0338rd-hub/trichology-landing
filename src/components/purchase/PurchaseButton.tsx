"use client";

import type { ReactNode } from "react";

import { usePurchase } from "@/components/purchase/PurchaseProvider";
import {
  getButtonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/Button";
import type { PlanId } from "@/types/plan";

interface PurchaseButtonProps {
  planId: PlanId;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  testId?: string;
}

export function PurchaseButton({
  planId,
  children,
  className,
  variant,
  size,
  fullWidth,
  testId,
}: PurchaseButtonProps) {
  const { openPurchase } = usePurchase();

  return (
    <button
      aria-controls="buyDialog"
      aria-haspopup="dialog"
      className={getButtonClassName({
        className,
        fullWidth,
        size,
        variant,
      })}
      data-plan={planId}
      data-testid={testId}
      onClick={() => openPurchase(planId)}
      type="button"
    >
      {children}
    </button>
  );
}
