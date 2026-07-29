import { trustBarContent } from "@/content/home";

export function TrustBar() {
  return (
    <section className="flex flex-wrap justify-center gap-9 border-y border-border px-5 py-[17px] text-xs leading-[1.5] tracking-[0.09em] text-muted uppercase max-[621px]:gap-3.5 max-[621px]:px-3.5 max-[621px]:py-3.5">
      {trustBarContent.items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </section>
  );
}
