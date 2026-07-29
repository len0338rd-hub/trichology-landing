import { cn } from "@/lib/utils";
import type { PriceDisplay as PriceDisplayContent } from "@/types/content";
import type { CurrencyCode } from "@/types/plan";

type PriceContext = "hero" | "plan" | "sticky";

interface PriceDisplayProps extends PriceDisplayContent {
  context?: PriceContext;
  className?: string;
}

export function formatPrice(
  price: number,
  currency: CurrencyCode,
  prefix?: string,
): string {
  const groupedPrice = String(price).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return [prefix, groupedPrice, currency].filter(Boolean).join(" ");
}

export function PriceDisplay({
  prefix,
  price,
  oldPrice,
  currency,
  badge,
  context = "hero",
  className,
}: PriceDisplayProps) {
  const Wrapper = context === "sticky" ? "span" : "div";

  return (
    <Wrapper
      className={cn(
        "flex flex-wrap items-baseline gap-3.5",
        context === "hero" && "mt-[22px] mb-[18px] h-[45px]",
        context === "plan" && "mb-[22px] gap-2.5",
        context === "sticky" && "inline-flex gap-1.5",
        className,
      )}
    >
      <b
        className={cn(
          context === "hero" && "text-[30px] leading-[1.5]",
          context === "plan" && "text-4xl leading-none max-[621px]:text-[34px]",
          context === "sticky" && "text-sm",
        )}
      >
        {formatPrice(price, currency, prefix)}
      </b>
      {oldPrice !== undefined ? (
        <s className={cn("text-[#998f89]", context === "sticky" && "text-xs")}>
          {formatPrice(oldPrice, currency, prefix)}
        </s>
      ) : null}
      {badge ? (
        <span className="rounded-full bg-launch px-3 py-2 text-[13px] font-bold">
          {badge}
        </span>
      ) : null}
    </Wrapper>
  );
}
