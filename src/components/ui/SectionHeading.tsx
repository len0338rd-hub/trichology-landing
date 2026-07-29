import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  description?: string;
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-[800px]", className)}>
      <div
        className={cn(
          "mb-5 text-xs leading-[1.5] font-extrabold tracking-[0.15em] text-accent uppercase",
          light && "text-[#dbc8bb]",
        )}
      >
        {eyebrow}
      </div>
      <h2 className="m-0 font-serif text-[clamp(32px,4vw,50px)] leading-[1.03] font-medium tracking-[-0.035em] max-[621px]:text-[34px]">
        {heading}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 mb-0 text-base text-muted",
            light && "text-[#eadfd7]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
