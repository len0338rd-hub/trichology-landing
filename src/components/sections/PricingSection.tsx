import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import { Container } from "@/components/ui/Container";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { pricingIntroContent } from "@/content/home";
import { plans } from "@/content/plans";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section
      className="py-[82px] max-[621px]:py-[60px]"
      id={pricingIntroContent.anchorId}
    >
      <Container>
        <div className="mb-[38px] max-w-[820px]">
          <div className="mb-5 text-xs leading-[1.5] font-extrabold tracking-[0.15em] text-accent uppercase">
            {pricingIntroContent.eyebrow.text}
          </div>
          <h2 className="m-0 font-serif text-[clamp(32px,4vw,50px)] leading-[1.03] font-medium tracking-[-0.035em] max-[621px]:text-[34px]">
            {pricingIntroContent.heading}
          </h2>
          <p className="mt-4 mb-0 max-w-[720px] text-base text-muted">
            {pricingIntroContent.description}
          </p>
        </div>
        <div
          className="grid grid-cols-3 items-stretch gap-4 max-[951px]:grid-cols-1 max-[951px]:gap-3.5"
          data-testid="pricing-grid"
        >
          {plans.map((plan) => {
            const featured = "featured" in plan && plan.featured;
            const note = "note" in plan ? plan.note : undefined;

            return (
              <article
                className={cn(
                  "flex flex-col rounded-[26px] border border-border bg-white p-[26px] shadow-[0_14px_38px_rgba(63,43,32,0.08)] max-[621px]:p-[23px]",
                  featured &&
                    "-translate-y-2.5 border-2 border-accent shadow-[var(--shadow-card)] max-[951px]:translate-y-0",
                )}
                data-testid={featured ? "featured-plan" : undefined}
                key={plan.id}
              >
                <span
                  className={cn(
                    "self-start rounded-full bg-soft px-[11px] py-[7px] text-xs leading-[1.5] font-extrabold tracking-[0.04em] text-accent-dark uppercase",
                    featured && "bg-accent text-white",
                  )}
                >
                  {plan.label}
                </span>
                <h3 className="mt-3.5 mb-2.5 font-serif text-[27px] leading-[1.08] font-bold max-[621px]:text-[25px]">
                  {plan.name}
                </h3>
                <p className="mt-0 mb-[22px] min-h-[68px] text-base text-muted max-[951px]:min-h-0">
                  {plan.description}
                </p>
                <PriceDisplay
                  context="plan"
                  currency={plan.currency}
                  oldPrice={plan.oldPrice}
                  price={plan.price}
                />
                <ul className="m-0 mb-7 flex-1 list-none p-0 text-muted">
                  {plan.features.map((feature) => (
                    <li
                      className="relative border-b border-border py-2 pl-[26px] before:absolute before:left-0 before:font-extrabold before:text-accent before:content-['✓']"
                      key={feature}
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
                <PurchaseButton
                  fullWidth
                  planId={plan.id}
                  testId={`purchase-trigger-${plan.id}`}
                >
                  {plan.ctaLabel}
                </PurchaseButton>
                {note ? (
                  <small className="mt-3.5 block text-center text-[12.5px] leading-[1.5] text-muted max-[621px]:text-[11.6667px]">
                    {note}
                  </small>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
