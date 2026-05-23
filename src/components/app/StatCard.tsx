import { cn } from "../../lib/cn";

type StatCardProps = {
  label: string;
  value: string | number;
  delta?: { value: string; tone?: "positive" | "negative" | "neutral" };
  hint?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  delta,
  hint,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-canvas border border-hairline-soft p-xl",
        className,
      )}
    >
      <p className="text-body-sm text-steel">{label}</p>
      <div className="mt-xs flex items-baseline gap-sm">
        <span className="text-heading-1 font-display text-ink">{value}</span>
        {delta && (
          <span
            className={cn(
              "text-body-sm-medium",
              delta.tone === "positive" && "text-success-accent",
              delta.tone === "negative" && "text-coral-dark",
              (!delta.tone || delta.tone === "neutral") && "text-steel",
            )}
          >
            {delta.value}
          </span>
        )}
      </div>
      {hint && <p className="mt-xs text-caption text-stone">{hint}</p>}
    </div>
  );
}
