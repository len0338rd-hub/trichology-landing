import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { incomeCalculationContent } from "@/content/home";

export function IncomeCalculationSection() {
  const [firstRow, secondRow] = incomeCalculationContent.rows;

  return (
    <section className="bg-accent-dark py-[72px] text-white">
      <Container className="grid grid-cols-[1.1fr_0.9fr] items-center gap-12 max-[951px]:grid-cols-1">
        <SectionHeading
          eyebrow={incomeCalculationContent.eyebrow.text}
          heading={incomeCalculationContent.heading}
          light
        />
        <div className="grid gap-2.5 rounded-3xl border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.06)] p-[26px]">
          <span className="text-[#eadfd7]">{firstRow.label}</span>
          <strong className="text-[28px]">{firstRow.value}</strong>
          <span className="text-[#eadfd7]">{secondRow.label}</span>
          <div className="mt-4 border-t border-[rgba(255,255,255,0.2)] pt-5 text-[30px] font-extrabold">
            {incomeCalculationContent.result}
          </div>
        </div>
      </Container>
    </section>
  );
}
