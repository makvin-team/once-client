import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-[44px] w-full rounded-md border border-hairline-strong bg-canvas px-md py-sm text-body-md text-ink",
        "placeholder:text-muted",
        "focus:outline-none focus:border-brand-blue focus:border-2 focus:px-[15px]",
        "transition-colors",
        className,
      )}
      {...props}
    />
  );
}
