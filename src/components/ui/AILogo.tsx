import { useTheme } from "../../lib/theme";
import { cn } from "../../lib/cn";

type Surface = "auto" | "light" | "dark" | "primary";

type AILogoProps = {
  size?: number;
  className?: string;
  /**
   * What kind of surface the logo is rendered on. Determines which of the
   * two assets to use:
   *
   * - `auto`    — follow the active theme (light surface → dark wordmark,
   *               dark surface → light wordmark). Default.
   * - `light`   — always render the dark wordmark, e.g. on pastel/yellow
   *               brand surfaces that stay bright in both themes.
   * - `dark`    — always render the light wordmark, e.g. on always-dark
   *               surfaces (footer, dark CTA banner).
   * - `primary` — match the primary pill button, which inverts in dark mode.
   */
  on?: Surface;
};

function pickSrc(theme: "light" | "dark", on: Surface): string {
  if (on === "light") return "/once-ai-light.png";
  if (on === "dark") return "/once-ai-dark.png";
  if (on === "primary") {
    return theme === "dark" ? "/once-ai-light.png" : "/once-ai-dark.png";
  }
  return theme === "dark" ? "/once-ai-dark.png" : "/once-ai-light.png";
}

export function AILogo({ size = 16, className, on = "auto" }: AILogoProps) {
  const { theme } = useTheme();
  const src = pickSrc(theme, on);
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      style={{ height: `${size}px`, width: "auto" }}
      className={cn("select-none", className)}
    />
  );
}
