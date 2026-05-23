import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-md md:flex-row md:items-end md:justify-between mb-section-sm",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-micro-uppercase uppercase text-steel mb-xs">
            {eyebrow}
          </p>
        )}
        <h1 className="text-heading-2 md:text-heading-1 font-display text-ink">
          {title}
        </h1>
        {description && (
          <p className="mt-xs text-body-md text-slate max-w-[640px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-xs flex-wrap">{actions}</div>
      )}
    </header>
  );
}
