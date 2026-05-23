import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant =
  | "primary"
  | "yellow"
  | "blue"
  | "secondary"
  | "on-dark"
  | "ghost"
  | "link";

type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-xs text-button-md whitespace-nowrap transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed";

// Notes per variant:
//   primary  — black pill in light, INVERTS to a white pill in dark mode so it
//              stays visually distinct against the dark canvas. Hover uses
//              opacity rather than `bg-charcoal` (which is themed and would
//              flash white in dark mode).
//   on-dark  — already meant for use inside dark surfaces; keeps its static
//              white-pill look in both modes.
//   secondary/ghost — transparent buttons with themed text/border, no override
//                     needed.
const variants: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-primary text-on-primary rounded-full",
    "hover:opacity-90 active:opacity-80",
    "disabled:bg-hairline disabled:text-muted disabled:opacity-100",
    "dark:bg-on-primary dark:text-primary",
  ),
  yellow: cn(
    "bg-brand-yellow text-primary rounded-full",
    "hover:bg-brand-yellow-deep active:bg-brand-yellow-deep",
  ),
  blue: cn(
    "bg-brand-blue text-on-primary rounded-full",
    "hover:bg-blue-450 active:bg-blue-pressed",
  ),
  secondary: cn(
    "bg-transparent text-ink rounded-full",
    "border border-hairline-strong",
    "hover:bg-surface",
  ),
  "on-dark": cn(
    "bg-on-dark text-primary rounded-full",
    "hover:opacity-90 active:opacity-80",
  ),
  ghost: "bg-transparent text-ink rounded-md hover:bg-surface",
  link: "bg-transparent text-brand-blue text-body-sm-medium underline-offset-2 hover:underline p-0",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-xl py-sm",
  lg: "px-2xl py-md",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const isLink = variant === "link";
  const isGhost = variant === "ghost";
  return (
    <button
      className={cn(
        base,
        variants[variant],
        !isLink && !isGhost && sizes[size],
        isGhost && "px-sm py-xs",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
