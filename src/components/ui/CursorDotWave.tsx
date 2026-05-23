import { useEffect, useRef } from "react";
import { useTheme } from "../../lib/theme";

// Halftone dot-grid that fades in around the cursor. Each dot keeps its own
// eased intensity, so dots smoothly appear when the cursor approaches and
// fade out when it moves away. When the pointer leaves the window the whole
// field gently disappears.
//
// Disabled on touch / coarse pointers and when prefers-reduced-motion is set.

const GRID_SPACING = 18;       // px between dots
const BASE_RADIUS = 0.0;       // hidden when no cursor influence
const MAX_RADIUS = 2.6;        // peak dot radius at cursor
const INFLUENCE_RADIUS = 240;  // px — distance over which the cursor affects dots
const CURSOR_EASE = 0.18;      // cursor follow easing (0–1)
const DOT_FADE = 0.12;         // per-dot intensity easing (0–1)
const GLOBAL_FADE = 0.06;      // overall enter/leave easing (0–1)
const MAX_ALPHA = 0.22;        // dot opacity at peak — visible against
                               // section bg/padding but never lands on a Card
                               // (cards self-elevate to z-10 above the wave).
const MIN_ALPHA = 0.0;         // ambient opacity (invisible when no cursor)

type CursorDotWaveProps = {
  // Stacking layer for the canvas. Default sits above page content (matches
  // the landing-page treatment); pass `behind` for app shells that want the
  // halftone field as a subtle background under cards and data.
  layer?: "above" | "behind";
};

export function CursorDotWave({ layer = "above" }: CursorDotWaveProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  // Mirror the latest theme into a ref so the long-running animation loop
  // can read it without restarting on every theme change.
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;

    // Per-dot eased intensities, length = cols * rows. Allocated on resize.
    let dotIntensity: Float32Array = new Float32Array(0);

    const target = { x: -9999, y: -9999 };
    const cursor = { x: -9999, y: -9999 };

    // 0 when the pointer is off-screen, 1 when active. Drives the global
    // appear/disappear animation so the field doesn't pop in/out.
    let presenceTarget = 0;
    let presence = 0;
    let hasCursor = false;

    let raf = 0;
    let alive = true;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / GRID_SPACING) + 2;
      rows = Math.ceil(height / GRID_SPACING) + 2;
      offsetX = (width - (cols - 1) * GRID_SPACING) / 2;
      offsetY = (height - (rows - 1) * GRID_SPACING) / 2;
      dotIntensity = new Float32Array(cols * rows);
    }

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!hasCursor) {
        // First touch: snap eased cursor so the field appears under the
        // pointer instead of flying in from the corner.
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        hasCursor = true;
      }
      presenceTarget = 1;
    }

    function onLeave() {
      presenceTarget = 0;
    }

    function onEnter() {
      presenceTarget = 1;
    }

    function draw() {
      if (!alive) return;
      ctx!.clearRect(0, 0, width, height);

      // Ease cursor toward target.
      cursor.x += (target.x - cursor.x) * CURSOR_EASE;
      cursor.y += (target.y - cursor.y) * CURSOR_EASE;

      // Ease global presence (enter/leave fade).
      presence += (presenceTarget - presence) * GLOBAL_FADE;

      const influenceSq = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
      const drawAtAll = presence > 0.005;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const gx = offsetX + i * GRID_SPACING;
          const gy = offsetY + j * GRID_SPACING;

          // Target intensity from radial falloff around the cursor.
          let aim = 0;
          if (hasCursor) {
            const dx = gx - cursor.x;
            const dy = gy - cursor.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < influenceSq) {
              const f = 1 - dSq / influenceSq;
              aim = f * f;
            }
          }

          // Ease per-dot intensity for smooth appear/disappear.
          const cur = dotIntensity[idx];
          const next = cur + (aim - cur) * DOT_FADE;
          dotIntensity[idx] = next;

          if (!drawAtAll) continue;

          const k = next * presence;
          if (k < 0.005) continue;

          const radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * k;
          const alpha = MIN_ALPHA + (MAX_ALPHA - MIN_ALPHA) * k;

          const rgb = themeRef.current === "dark" ? "235, 235, 240" : "60, 60, 65";
          ctx!.beginPath();
          ctx!.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx!.arc(gx, gy, radius, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerenter", onEnter);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // `above` sits at z-0 (positioned, so it composites over non-positioned
  // section backgrounds and headings) but Card components elevate themselves
  // to z-10 so the halftone never lands on a card surface — visible in
  // section padding, hidden behind cards.
  const layerClass =
    layer === "behind"
      ? "pointer-events-none fixed inset-0 -z-10"
      : "pointer-events-none fixed inset-0 z-0 mix-blend-multiply dark:mix-blend-screen";

  return <canvas ref={canvasRef} aria-hidden className={layerClass} />;
}
