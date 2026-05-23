import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-hairline-strong bg-canvas px-md py-sm text-body-md text-ink min-h-[120px] resize-y",
        "placeholder:text-muted",
        "focus:outline-none focus:border-brand-blue focus:border-2 focus:px-[15px]",
        "transition-colors",
        className,
      )}
      {...props}
    />
  );
}
