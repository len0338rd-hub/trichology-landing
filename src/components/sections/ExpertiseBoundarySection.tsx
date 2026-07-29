import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expertiseBoundaryContent } from "@/content/home";
import { siteImages } from "@/content/images";

export function ExpertiseBoundarySection() {
  const image = siteImages.scalpDiagnostics;

  return (
    <section className="py-[82px] max-[621px]:py-[60px]">
      <Container className="grid grid-cols-2 items-center gap-[52px] max-[951px]:grid-cols-1 max-[951px]:gap-[38px]">
        <Image
          alt={image.alt}
          className="aspect-[4/4.7] max-h-[570px] w-full rounded-[var(--radius-card)] object-cover shadow-[var(--shadow-card)]"
          height={image.height}
          sizes="(max-width: 950px) calc(100vw - 24px), 48vw"
          src={image.src}
          width={image.width}
        />
        <div>
          <SectionHeading
            description={expertiseBoundaryContent.description}
            eyebrow={expertiseBoundaryContent.eyebrow.text}
            heading={expertiseBoundaryContent.heading}
          />
          <ul className="mt-4 mb-[15px] list-none p-0 max-[621px]:mb-3.5">
            {expertiseBoundaryContent.checklist.map((item) => (
              <li
                className="relative border-b border-border py-3 pl-8 before:absolute before:left-0 before:font-extrabold before:text-accent before:content-['✓']"
                key={item.title}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
