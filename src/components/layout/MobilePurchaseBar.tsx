import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { stickyPurchaseBarContent } from "@/content/site";

export function MobilePurchaseBar() {
  return (
    <aside
      className="fixed right-3 bottom-3 left-3 z-[18] hidden items-center justify-between rounded-full bg-[rgba(255,255,255,0.95)] py-2.5 pr-3 pl-[18px] shadow-[var(--shadow-card)] backdrop-blur-[14px] max-[951px]:flex"
      data-testid="mobile-purchase-bar"
    >
      <PriceDisplay {...stickyPurchaseBarContent.price} context="sticky" />
      <Button href={stickyPurchaseBarContent.cta.href} size="small">
        {stickyPurchaseBarContent.cta.label}
      </Button>
    </aside>
  );
}
