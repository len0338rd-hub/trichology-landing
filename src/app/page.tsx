import { MobilePurchaseBar } from "@/components/layout/MobilePurchaseBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PurchaseDialog } from "@/components/purchase/PurchaseDialog";
import { PurchaseProvider } from "@/components/purchase/PurchaseProvider";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { ExpertiseBoundarySection } from "@/components/sections/ExpertiseBoundarySection";
import { FaqSection } from "@/components/sections/FaqSection";
import { GuideContentsSection } from "@/components/sections/GuideContentsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { IncomeCalculationSection } from "@/components/sections/IncomeCalculationSection";
import { InvestmentSection } from "@/components/sections/InvestmentSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { TrustBar } from "@/components/sections/TrustBar";
import { env } from "@/lib/env";
import { isStripeCheckoutReady } from "@/lib/stripe";
import type { PurchaseConfiguration } from "@/types/purchase";

const purchaseConfiguration = {
  telegramUsername: env.telegramUsername ?? "",
  contactEmail: env.contactEmail ?? "",
  paymentAccount: env.paymentAccount ?? "",
  paymentRecipient: env.paymentRecipient ?? "",
  paymentPurpose: env.paymentPurpose ?? "",
  stripeCheckoutReady: isStripeCheckoutReady,
} as const satisfies PurchaseConfiguration;

export default function HomePage() {
  return (
    <PurchaseProvider configuration={purchaseConfiguration}>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <TrustBar />
        <BenefitsSection />
        <ExpertiseBoundarySection />
        <GuideContentsSection />
        <IncomeCalculationSection />
        <QuoteSection />
        <InvestmentSection />
        <PricingSection />
        <FaqSection />
      </main>
      <SiteFooter />
      <MobilePurchaseBar />
      <PurchaseDialog />
    </PurchaseProvider>
  );
}
