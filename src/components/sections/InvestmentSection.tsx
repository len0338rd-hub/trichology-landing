import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { formatPrice } from "@/components/ui/PriceDisplay";
import { investmentContent } from "@/content/home";
import { cn } from "@/lib/utils";

export function InvestmentSection() {
  const [schoolFormat, guideFormat] = investmentContent.comparison.formats;
  const savings = investmentContent.comparison.savings;

  return (
    <section className="investment-section relative overflow-hidden bg-accent-dark py-[74px] text-white max-[621px]:py-14">
      <span
        aria-hidden="true"
        className="absolute -top-40 -right-[120px] size-[440px] rounded-full border border-[rgba(255,255,255,0.09)] shadow-[0_0_0_70px_rgba(255,255,255,0.025),0_0_0_140px_rgba(255,255,255,0.018)]"
      />
      <Container className="relative z-[1] grid grid-cols-[1.08fr_0.92fr] items-center gap-16 max-[951px]:grid-cols-1 max-[951px]:gap-9">
        <div className="max-w-[650px] max-[951px]:max-w-[760px]">
          <div className="mb-5 text-xs leading-[1.5] font-extrabold tracking-[0.15em] text-[#dbc8bb] uppercase">
            {investmentContent.eyebrow.text}
          </div>
          <h2 className="m-0 font-serif text-[clamp(34px,4.2vw,52px)] leading-[1.04] font-medium tracking-[-0.035em] max-[621px]:text-[34px]">
            {investmentContent.heading}
          </h2>
          <p className="my-[22px] max-w-[610px] text-[17px] text-[#eadfd7] max-[621px]:text-[15px]">
            {investmentContent.description}
          </p>
          <div className="mt-[26px] flex flex-wrap gap-3 max-[621px]:[&_.site-button]:w-full">
            <PurchaseButton
              planId={investmentContent.purchaseAction.planId}
              testId="purchase-trigger-investment"
            >
              {investmentContent.purchaseAction.label}
            </PurchaseButton>
            <Button href={investmentContent.plansLink.href} variant="ghost">
              {investmentContent.plansLink.label}
            </Button>
          </div>
          <div className="mt-[22px] flex flex-wrap gap-4 text-xs leading-[1.5] tracking-[0.07em] text-[#dbc8bb] uppercase max-[621px]:gap-x-3 max-[621px]:gap-y-2">
            {investmentContent.points.map((point) => (
              <span
                className="after:ml-4 after:content-['·'] last:after:hidden max-[621px]:after:ml-3"
                key={point.text}
              >
                {point.text}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white p-[30px] text-foreground shadow-[0_24px_60px_rgba(25,15,10,0.24)] max-[951px]:max-w-[650px] max-[621px]:p-[23px]">
          <div className="mb-[18px] text-[13px] font-extrabold tracking-[0.08em] text-accent-dark uppercase">
            {investmentContent.comparison.title}
          </div>
          <div
            className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3.5 max-[621px]:grid-cols-1"
            data-testid="saving-compare"
          >
            {[schoolFormat, guideFormat].map((format, index) => (
              <div
                className={cn(
                  "flex min-h-[132px] flex-col justify-between rounded-[17px] bg-soft p-[18px] max-[621px]:min-h-28",
                  index === 0 && "col-start-1 row-start-1",
                  index === 1 && "bg-accent-dark text-white",
                  index === 1 &&
                    "col-start-3 row-start-1 max-[621px]:col-start-1 max-[621px]:row-start-3",
                )}
                key={format.label}
              >
                <span
                  className={cn(
                    "text-xs leading-[1.5] font-extrabold tracking-[0.05em] text-muted uppercase",
                    index === 1 && "text-[#dbc8bb]",
                  )}
                >
                  {format.label}
                </span>
                {"crossedOut" in format && format.crossedOut ? (
                  <s className="mt-3.5 block text-[25px] leading-[1.05] text-[#968a84] decoration-accent decoration-3 max-[621px]:text-2xl">
                    {formatPrice(
                      format.price,
                      format.currency,
                      "pricePrefix" in format ? format.pricePrefix : undefined,
                    )}
                  </s>
                ) : (
                  <b className="mt-3.5 block text-[31px] leading-[1.05] text-white max-[621px]:text-[30px]">
                    {formatPrice(
                      format.price,
                      format.currency,
                      "pricePrefix" in format ? format.pricePrefix : undefined,
                    )}
                  </b>
                )}
              </div>
            ))}
            <div className="col-start-2 row-start-1 self-center text-[11px] font-black tracking-[0.08em] text-accent uppercase max-[621px]:col-start-1 max-[621px]:row-start-2 max-[621px]:text-center">
              {investmentContent.comparison.separator}
            </div>
          </div>
          <div className="mt-[22px] border-t border-border pt-[22px]">
            <span className="block font-extrabold text-accent uppercase">
              <b className="block text-2xl leading-[1.05] tracking-[0.07em]">
                {savings.label}
              </b>
            </span>
            <div
              className="mt-2.5 mb-3 flex items-baseline gap-3 rounded-r-[14px] border-l-4 border-accent bg-soft px-4 py-3.5 max-[621px]:flex-col max-[621px]:items-start max-[621px]:gap-[7px]"
              data-testid="saving-amount"
            >
              <strong className="block font-serif text-[44px] leading-none text-accent-dark max-[621px]:text-[40px]">
                {formatPrice(
                  savings.amount,
                  savings.currency,
                  savings.amountPrefix,
                )}
              </strong>
              <em className="text-[11px] font-black tracking-[0.08em] text-accent not-italic uppercase">
                {savings.suffix}
              </em>
            </div>
            <p className="m-0 text-muted">
              {investmentContent.comparison.explanation}
            </p>
          </div>
          <small className="mt-[18px] block border-t border-border pt-[15px] text-[11px] text-[#8a7f79]">
            {investmentContent.comparison.note}
          </small>
        </div>
      </Container>
    </section>
  );
}
