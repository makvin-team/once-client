import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "default" | "soft";
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  tone = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-xl py-section rounded-2xl border",
        tone === "soft"
          ? "border-dashed border-hairline bg-surface-soft"
          : "border-hairline-soft bg-canvas",
        className,
      )}
    >
      {icon && (
        <div className="mb-md w-14 h-14 rounded-full bg-surface-yellow text-yellow-dark inline-flex items-center justify-center pastel">
          {icon}
        </div>
      )}
      <h3 className="text-heading-4 text-ink font-display">{title}</h3>
      {description && (
        <p className="mt-xs text-body-md text-slate max-w-[480px]">
          {description}
        </p>
      )}
      {action && <div className="mt-md">{action}</div>}
    </div>
  );
}
