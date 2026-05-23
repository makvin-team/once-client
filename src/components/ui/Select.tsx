import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: ReadonlyArray<string> | string[];
  placeholder?: string;
};

export function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-[44px] w-full appearance-none rounded-md border border-hairline-strong bg-canvas pl-md pr-2xl py-sm text-body-md text-ink",
          "focus:outline-none focus:border-brand-blue focus:border-2 focus:pl-[15px]",
          "transition-colors",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-md top-1/2 -translate-y-1/2 text-stone"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden
      >
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
