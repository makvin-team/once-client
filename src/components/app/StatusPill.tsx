import { cn } from "../../lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "muted";

const TONE_STYLES: Record<Tone, string> = {
  neutral: "bg-surface text-ink",
  success: "bg-success-accent/15 text-success-accent",
  warning: "bg-surface-yellow text-yellow-dark",
  danger: "bg-coral-light text-coral-dark",
  info: "bg-surface-pricing-featured text-brand-blue",
  muted: "bg-surface-soft text-steel",
};

type StatusPillProps = {
  label: string;
  tone?: Tone;
  className?: string;
};

export function StatusPill({ label, tone = "neutral", className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-xs py-[2px] rounded-full text-caption-bold pastel",
        TONE_STYLES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

// Map common entity statuses to a tone for consistency.
// eslint-disable-next-line react-refresh/only-export-components
export function statusTone(status: string): Tone {
  switch (status) {
    case "active":
    case "completed":
    case "passed":
    case "published":
    case "sent":
    case "ok":
      return "success";
    case "pending":
    case "in_progress":
    case "processing":
    case "submitted":
    case "started":
    case "retrying":
      return "warning";
    case "failed":
    case "blocked":
    case "denied":
      return "danger";
    case "draft":
    case "archived":
    case "not_started":
    case "locked":
    case "inactive":
    case "expired":
      return "muted";
    default:
      return "neutral";
  }
}
