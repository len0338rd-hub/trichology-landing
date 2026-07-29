import { Container } from "@/components/ui/Container";
import { quoteContent } from "@/content/home";

export function QuoteSection() {
  return (
    <section className="py-[66px] max-[621px]:py-[52px]">
      <Container>
        <blockquote className="m-auto max-w-[980px] text-center font-serif text-[clamp(30px,4vw,48px)] leading-[1.12] italic text-accent-dark">
          {quoteContent.text}
        </blockquote>
      </Container>
    </section>
  );
}
