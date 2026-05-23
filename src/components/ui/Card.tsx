import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type CardTone = "canvas" | "yellow" | "coral" | "teal" | "rose" | "orange";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  size?: "base" | "feature";
  children: ReactNode;
};

// Pastel tones use static bright backgrounds; the `.pastel` utility keeps any
// themed text descendants dark in both modes.
const tones: Record<CardTone, string> = {
  canvas: "bg-canvas text-ink border border-hairline-soft",
  yellow: "bg-brand-yellow text-primary pastel",
  coral: "bg-coral-light text-primary pastel",
  teal: "bg-teal-light text-primary pastel",
  rose: "bg-rose-light text-primary pastel",
  orange: "bg-brand-orange-light text-primary pastel",
};

export function Card({
  tone = "canvas",
  size = "feature",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        // `relative z-10` keeps the card surface above the CursorDotWave
        // halftone (which renders at z-0 in `above` mode) so dots never
        // tint the card background.
        "relative z-10",
        tones[tone],
        size === "feature" ? "rounded-3xl p-2xl" : "rounded-xl p-xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
