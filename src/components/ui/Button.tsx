import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { PlanId } from "@/types/plan";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "default" | "small";

interface CommonButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

interface LinkButtonProps extends CommonButtonProps {
  href: string;
  type?: never;
  dataPlan?: never;
  disabled?: never;
}

interface ActionButtonProps extends CommonButtonProps {
  href?: never;
  type?: "button";
  dataPlan?: PlanId;
  disabled?: boolean;
}

type ButtonProps = LinkButtonProps | ActionButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "site-button--primary border-accent bg-accent text-white shadow-[0_12px_30px_rgba(141,106,86,0.22)] hover:border-accent-dark hover:bg-accent-dark",
  ghost:
    "site-button--ghost border-border bg-transparent text-foreground shadow-none hover:border-accent hover:bg-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-[50px] px-6",
  small: "min-h-10 px-[18px]",
};

export function getButtonClassName({
  variant = "primary",
  size = "default",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}): string {
  return cn(
    "site-button inline-flex cursor-pointer items-center justify-center rounded-full border font-extrabold no-underline transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export function Button(props: ButtonProps) {
  const { children } = props;
  const classes = getButtonClassName(props);

  if ("href" in props && props.href) {
    return (
      <a className={classes} href={props.href}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      data-plan={props.dataPlan}
      disabled={props.disabled}
      type={props.type ?? "button"}
    >
      {children}
    </button>
  );
}
