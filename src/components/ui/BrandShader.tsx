import { cn } from "../../lib/cn";

type BrandShaderProps = {
  className?: string;
};

// Decorative SVG overlay for brand-tinted cards. Renders a soft radial wash
// plus a faint dot grid, both in the primary ink color at low opacity so it
// reads as a subtle texture against the yellow / pastel surfaces.
export function BrandShader({ className }: BrandShaderProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none select-none", className)}
    >
      <defs>
        <radialGradient id="brand-shader-wash" cx="80%" cy="10%" r="80%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.04" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="brand-shader-dots"
          x="0"
          y="0"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" fillOpacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brand-shader-dots)" />
      <rect width="100%" height="100%" fill="url(#brand-shader-wash)" />
    </svg>
  );
}
