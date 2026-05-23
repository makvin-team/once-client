// Small set of monoline icons used across the sidebar / app. All inherit
// `currentColor` so they theme correctly. 16px viewBox.

type IconProps = { className?: string };

export const Icon = {
  Home: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M2 7l6-5 6 5v6a1 1 0 0 1-1 1h-3v-4H6v4H3a1 1 0 0 1-1-1V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Book: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M3 3h6a2 2 0 0 1 2 2v8H5a2 2 0 0 1-2-2V3ZM11 5h2v8h-8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Sparkle: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M8 1.5l1.4 4.1L13.5 7 9.4 8.4 8 12.5 6.6 8.4 2.5 7 6.6 5.6 8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Play: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M4 2l9 6-9 6V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Chat: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6l-3 2v-2H4a2 2 0 0 1-2-2V4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M8 1.5l5.5 2v5C13.5 11.5 11.2 14 8 15c-3.2-1-5.5-3.5-5.5-6.5v-5L8 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Chart: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M2 13h12M4 13V8M7 13V4M10 13V9M13 13V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Bell: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M4 11V7a4 4 0 0 1 8 0v4l1.5 1.5h-11L4 11ZM6.5 14a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Cog: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Users: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 14a4.5 4.5 0 0 1 9 0M11 7a2 2 0 1 0 0-4M14.5 14a3.5 3.5 0 0 0-3-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Doc: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M3 1.5h6l4 4V14a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 14V1.5ZM9 1.5V5h4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Building: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M2.5 14h11V4l-4-2v2h-7v10ZM5.5 6h2M5.5 9h2M5.5 12h2M11 7v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Plug: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M5 7V3.5M11 7V3.5M3.5 7h9v3a4.5 4.5 0 1 1-9 0V7ZM8 14.5V13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Clipboard: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M5.5 2.5h5v2h-5v-2ZM3.5 4.5h9V14h-9V4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Bolt: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M9.5 1.5L3 9h4l-.5 5.5L13 6H9l.5-4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  Audit: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M2.5 3.5h11v10h-11v-10ZM5 6.5h6M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Quiz: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 6a2 2 0 1 1 2.5 1.9V9M8 12v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  Trophy: (p: IconProps) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...p} aria-hidden>
      <path d="M4 2.5h8V6a4 4 0 0 1-8 0V2.5ZM6 11h4v3H6v-3ZM2.5 3.5H4M12 3.5h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
} as const;
