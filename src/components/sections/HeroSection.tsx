import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { heroContent } from "@/content/home";
import { siteImages } from "@/content/images";
import type { EmphasizedHeading } from "@/types/content";

export function HeroSection() {
  const image = siteImages.heroConsultation;
  const heading: EmphasizedHeading = heroContent.heading;

  return (
    <section>
      <Container
        className="grid min-h-[calc(100svh_-_61px)] grid-cols-[1.04fr_0.96fr] items-center gap-[52px] py-[42px] pb-[52px] max-[951px]:min-h-0 max-[951px]:grid-cols-1 max-[951px]:gap-[38px] max-[951px]:py-[52px] max-[951px]:pb-[62px] max-[621px]:gap-[30px] max-[621px]:py-[34px] max-[621px]:pb-11"
        dataTestId="hero-grid"
      >
        <div>
          <div className="mb-5 text-xs leading-[1.5] font-extrabold tracking-[0.15em] text-accent uppercase">
            {heroContent.eyebrow.text}
          </div>
          <h1 className="m-0 font-serif text-[clamp(40px,5.2vw,62px)] leading-[1.03] font-medium tracking-[-0.035em] max-[621px]:text-[38px]">
            {heading.before}
            <em className="text-accent">{heading.emphasis}</em>
            {heading.after}
          </h1>
          <p className="my-[22px] text-lg leading-[1.5] text-muted max-[621px]:text-base">
            {heroContent.lead}
          </p>
          <PriceDisplay {...heroContent.price} />
          <div
            className="flex flex-wrap gap-3 max-[621px]:[&_.site-button]:w-full"
            data-testid="hero-actions"
          >
            <Button href={heroContent.primaryAction.href}>
              {heroContent.primaryAction.label}
            </Button>
            <Button href={heroContent.secondaryAction.href} variant="ghost">
              {heroContent.secondaryAction.label}
            </Button>
          </div>
          <ul className="mt-5 mb-0 flex list-none flex-wrap gap-3.5 p-0 text-[13px] text-muted">
            {heroContent.highlights.map((highlight) => (
              <li
                className="before:mr-2 before:text-accent before:content-['•']"
                key={highlight}
              >
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <Image
            alt={image.alt}
            className="aspect-[4/4.6] max-h-[520px] w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)] max-[951px]:max-h-[560px] max-[621px]:max-h-[460px]"
            height={image.height}
            priority
            sizes="(max-width: 950px) calc(100vw - 24px), 48vw"
            src={image.src}
            width={image.width}
          />
          <div className="absolute right-[-12px] bottom-6 max-w-[270px] rounded-[18px] bg-[rgba(255,255,255,0.94)] p-4 shadow-[var(--shadow-card)] backdrop-blur-[10px] max-[951px]:right-2.5">
            <strong className="block">{heroContent.floatingCard.title}</strong>
            <span className="text-sm text-muted">
              {heroContent.floatingCard.text}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
