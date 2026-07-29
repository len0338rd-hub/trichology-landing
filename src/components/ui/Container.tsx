import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  dataTestId?: string;
}

export function Container({ children, className, dataTestId }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-[calc(100%_-_40px)] max-w-[1100px] max-[621px]:w-[calc(100%_-_24px)]",
        className,
      )}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
}
