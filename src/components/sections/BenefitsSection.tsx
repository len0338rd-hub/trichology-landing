import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { benefitsContent } from "@/content/home";

export function BenefitsSection() {
  return (
    <section className="py-[82px] max-[621px]:py-[60px]">
      <Container>
        <SectionHeading
          className="mb-[38px]"
          eyebrow={benefitsContent.eyebrow.text}
          heading={benefitsContent.heading}
        />
        <div
          className="grid grid-cols-4 gap-3.5 max-[951px]:grid-cols-2 max-[621px]:grid-cols-1"
          data-testid="benefits-grid"
        >
          {benefitsContent.cards.map((card) => (
            <article
              className="min-h-[225px] rounded-[22px] border border-border bg-[rgba(255,255,255,0.68)] p-6"
              key={card.number}
            >
              <span className="mb-11 block font-extrabold text-accent">
                {card.number}
              </span>
              <h3 className="mt-0 mb-3 font-serif text-[23px] font-bold">
                {card.title}
              </h3>
              <p className="m-0 text-muted">{card.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
