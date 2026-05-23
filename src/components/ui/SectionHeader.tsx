import { cn } from "../../lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  invert?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  invert,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-[820px]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-micro-uppercase uppercase mb-md",
            invert ? "text-on-dark-muted" : "text-steel",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-heading-2 md:text-heading-1 font-display",
          invert ? "text-on-primary" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-md text-subtitle",
            invert ? "text-on-dark-muted" : "text-slate",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
