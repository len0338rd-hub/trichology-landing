import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/content/faq";
import { faqIntroContent } from "@/content/home";

export function FaqSection() {
  return (
    <section
      className="py-[82px] max-[621px]:py-[60px]"
      id={faqIntroContent.anchorId}
    >
      <Container>
        <SectionHeading
          className="mb-[38px]"
          eyebrow={faqIntroContent.eyebrow.text}
          heading={faqIntroContent.heading}
        />
        <div>
          {faqItems.map((item) => (
            <details
              className="group border-t border-border py-[18px] last:border-b"
              key={item.id}
            >
              <summary className="cursor-pointer text-lg leading-[1.5] font-extrabold">
                {item.question}
              </summary>
              <p className="mb-0 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
