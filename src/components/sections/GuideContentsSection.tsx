import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guideContentsContent } from "@/content/home";

export function GuideContentsSection() {
  return (
    <section
      className="py-[82px] max-[621px]:py-[60px]"
      id={guideContentsContent.anchorId}
    >
      <Container>
        <SectionHeading
          className="mb-[38px]"
          eyebrow={guideContentsContent.eyebrow.text}
          heading={guideContentsContent.heading}
        />
        <div className="max-w-[900px]">
          {guideContentsContent.modules.map((module) => (
            <article
              className="grid grid-cols-[52px_1fr] gap-[18px] border-b border-border py-6"
              key={module.number}
            >
              <b className="text-accent">{module.number}</b>
              <div>
                <h3 className="mt-0 mb-1.5 font-serif text-[22px] font-bold">
                  {module.title}
                </h3>
                <p className="m-0 text-muted">{module.description}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
