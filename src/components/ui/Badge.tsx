import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant =
  | "promo"
  | "tag-yellow"
  | "tag-purple"
  | "tag-coral"
  | "tag-teal"
  | "success"
  | "discount";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

const variants: Record<BadgeVariant, string> = {
  promo: "bg-brand-yellow text-primary rounded-full px-[10px] py-1",
  "tag-yellow":
    "bg-surface-yellow text-yellow-dark rounded-full px-[10px] py-1",
  "tag-purple":
    "bg-surface-pricing-featured text-brand-blue rounded-full px-[10px] py-1",
  "tag-coral": "bg-coral-light text-coral-dark rounded-full px-[10px] py-1",
  "tag-teal": "bg-teal-light text-moss-dark rounded-full px-[10px] py-1",
  success: "bg-success-accent text-on-primary rounded-full px-[10px] py-1",
  discount: "bg-brand-yellow text-primary rounded-sm px-[6px] py-[2px]",
};

export function Badge({
  variant = "tag-yellow",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-caption-bold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
