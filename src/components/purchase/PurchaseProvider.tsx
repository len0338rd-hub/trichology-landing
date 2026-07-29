"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { plans } from "@/content/plans";
import { purchaseDialogContent } from "@/content/purchase";
import type { Plan, PlanId } from "@/types/plan";
import type { PurchaseConfiguration } from "@/types/purchase";

interface PurchaseContextValue {
  selectedPlanId: PlanId;
  selectedPlan: Plan;
  isPurchaseDialogOpen: boolean;
  configuration: PurchaseConfiguration;
  openPurchase: (planId: PlanId) => void;
  closePurchase: () => void;
}

interface PurchaseProviderProps {
  children: ReactNode;
  configuration: PurchaseConfiguration;
}

const PurchaseContext = createContext<PurchaseContextValue | null>(null);

function findPlan(planId: string): Plan {
  return (
    plans.find((plan) => plan.id === planId) ??
    plans.find((plan) => plan.id === purchaseDialogContent.fallbackPlanId) ??
    plans[0]
  );
}

export function PurchaseProvider({
  children,
  configuration,
}: PurchaseProviderProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(
    purchaseDialogContent.fallbackPlanId,
  );
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const selectedPlan = findPlan(selectedPlanId);

  const openPurchase = useCallback((planId: PlanId) => {
    const activeElement = document.activeElement;
    triggerRef.current =
      activeElement instanceof HTMLElement ? activeElement : null;
    setSelectedPlanId(findPlan(planId).id);
    setIsPurchaseDialogOpen(true);
  }, []);

  const closePurchase = useCallback(() => {
    setIsPurchaseDialogOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const value = useMemo<PurchaseContextValue>(
    () => ({
      selectedPlanId,
      selectedPlan,
      isPurchaseDialogOpen,
      configuration,
      openPurchase,
      closePurchase,
    }),
    [
      closePurchase,
      configuration,
      isPurchaseDialogOpen,
      openPurchase,
      selectedPlan,
      selectedPlanId,
    ],
  );

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase(): PurchaseContextValue {
  const context = useContext(PurchaseContext);

  if (!context) {
    throw new Error("usePurchase must be used within PurchaseProvider");
  }

  return context;
}
