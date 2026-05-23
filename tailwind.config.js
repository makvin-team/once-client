/** @type {import('tailwindcss').Config} */
//
// Color tokens are split into two groups:
//
//   Static brand colors      → hex literals (same in light + dark)
//   Themed surface / text    → CSS variables (light = :root, dark = .dark)
//
// To flip the whole site to dark mode, toggle `class="dark"` on <html>.
// See src/lib/theme.ts for the storage + system-preference logic.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Roobert PRO"',
          "Inter",
          '"Noto Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        display: [
          '"Roobert PRO"',
          "Inter",
          '"Noto Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        // === Themed (CSS variables — flip in dark mode) ===
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-soft": "rgb(var(--c-surface-soft) / <alpha-value>)",
        "surface-yellow": "rgb(var(--c-surface-yellow) / <alpha-value>)",
        "surface-pricing-featured":
          "rgb(var(--c-surface-pricing-featured) / <alpha-value>)",
        hairline: "rgb(var(--c-hairline) / <alpha-value>)",
        "hairline-soft": "rgb(var(--c-hairline-soft) / <alpha-value>)",
        "hairline-strong": "rgb(var(--c-hairline-strong) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        "ink-deep": "rgb(var(--c-ink-deep) / <alpha-value>)",
        charcoal: "rgb(var(--c-charcoal) / <alpha-value>)",
        slate: "rgb(var(--c-slate) / <alpha-value>)",
        steel: "rgb(var(--c-steel) / <alpha-value>)",
        stone: "rgb(var(--c-stone) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",

        // === Semantic inverted surfaces (themed too, but kept "dark-feeling"
        // even in light mode for footer + CTA banner) ===
        primary: "rgb(var(--c-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--c-on-primary) / <alpha-value>)",
        "footer-bg": "rgb(var(--c-footer-bg) / <alpha-value>)",
        "on-dark": "rgb(var(--c-on-dark) / <alpha-value>)",
        "on-dark-muted": "rgb(var(--c-on-dark-muted) / <alpha-value>)",

        // === Static brand colors (same in both modes) ===
        "brand-yellow": "#ffd02f",
        "brand-yellow-deep": "#fcb900",
        "yellow-light": "#fff4c4",
        "yellow-dark": "#746019",
        "brand-blue": "#4262ff",
        "blue-450": "#5b76fe",
        "blue-pressed": "#2a41b6",
        "brand-coral": "#ff9999",
        "coral-light": "#ffc6c6",
        "coral-dark": "#600000",
        "brand-rose": "#ffd8f4",
        "rose-light": "#fde0f0",
        "brand-pink": "#fde0f0",
        "brand-teal": "#0fbcb0",
        "teal-light": "#c3faf5",
        "moss-dark": "#187574",
        "brand-orange-light": "#ffe6cd",
        "brand-red": "#fbd4d4",
        "brand-red-dark": "#e3c5c5",
        "success-accent": "#00b473",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "28px",
        feature: "32px",
        full: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        "section-sm": "48px",
        section: "64px",
        "section-lg": "96px",
        hero: "120px",
      },
      fontSize: {
        "hero-display": ["80px", { lineHeight: "1.05", letterSpacing: "-2px", fontWeight: "500" }],
        "display-lg": ["60px", { lineHeight: "1.10", letterSpacing: "-1.5px", fontWeight: "500" }],
        "heading-1": ["48px", { lineHeight: "1.15", letterSpacing: "-1px", fontWeight: "500" }],
        "heading-2": ["36px", { lineHeight: "1.20", letterSpacing: "-0.5px", fontWeight: "500" }],
        "heading-3": ["28px", { lineHeight: "1.25", fontWeight: "500" }],
        "heading-4": ["22px", { lineHeight: "1.30", fontWeight: "500" }],
        "heading-5": ["18px", { lineHeight: "1.40", fontWeight: "500" }],
        subtitle: ["18px", { lineHeight: "1.50", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.50", fontWeight: "400" }],
        "body-md-medium": ["16px", { lineHeight: "1.50", fontWeight: "500" }],
        "body-sm": ["14px", { lineHeight: "1.50", fontWeight: "400" }],
        "body-sm-medium": ["14px", { lineHeight: "1.50", fontWeight: "500" }],
        caption: ["13px", { lineHeight: "1.40", fontWeight: "400" }],
        "caption-bold": ["13px", { lineHeight: "1.40", fontWeight: "600" }],
        micro: ["12px", { lineHeight: "1.40", fontWeight: "500" }],
        "micro-uppercase": ["11px", { lineHeight: "1.40", letterSpacing: "0.5px", fontWeight: "600" }],
        "button-md": ["14px", { lineHeight: "1.30", fontWeight: "500" }],
        "stat-display": ["64px", { lineHeight: "1.10", letterSpacing: "-1.5px", fontWeight: "500" }],
      },
      boxShadow: {
        "elev-1": "rgba(5, 0, 56, 0.04) 0px 1px 2px 0px",
        "elev-2": "rgba(5, 0, 56, 0.06) 0px 4px 12px 0px",
        "elev-3": "rgba(5, 0, 56, 0.08) 0px 12px 32px -4px",
        "elev-4": "rgba(5, 0, 56, 0.12) 0px 16px 48px -8px",
      },
      maxWidth: {
        container: "1280px",
      },
    },
  },
  plugins: [],
};
