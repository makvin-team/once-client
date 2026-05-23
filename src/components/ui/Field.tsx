import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  error,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-xs", className)}>
      <label
        htmlFor={htmlFor}
        className="text-body-sm-medium text-ink"
      >
        {label}
        {required && <span className="text-brand-coral ml-0.5" aria-hidden>*</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-caption text-coral-dark"
        >
          {error}
        </p>
      )}
    </div>
  );
}
