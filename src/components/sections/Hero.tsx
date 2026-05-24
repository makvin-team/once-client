import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useT } from "../../i18n";
import { onAnchorClick } from "../../lib/scroll";
import { track } from "../../lib/analytics";

const badgeVariants = {
  yellow: "tag-yellow",
  coral: "tag-coral",
  teal: "tag-teal",
  rose: "tag-purple",
} as const;

export function Hero() {
  const t = useT();
  const hero = t.hero;

  const remainingTitle = hero.title.replace(hero.titleHighlight, "").trim();

  // Reveal the demo video (scale + fade) once it scrolls into view.
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Hero copy — fills the first viewport. */}
      <section className="relative isolate overflow-hidden bg-canvas">
        <img
          aria-hidden
          src="/grid.png"
          alt=""
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-top -z-10 pointer-events-none select-none opacity-[0.05]"
        />
        <div className="mx-auto max-w-container px-2xl text-center flex flex-col items-center justify-center py-2xl min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-112px)]">
          <Badge variant="tag-purple" className="mb-md">
            {hero.eyebrow}
          </Badge>
          <h1 className="text-heading-1 md:text-display-lg text-ink font-display max-w-[900px] mx-auto">
            <span className="text-brand-yellow-deep">{hero.titleHighlight}</span>{" "}
            {remainingTitle}
          </h1>
          <p className="mt-md mx-auto max-w-[720px] text-subtitle text-slate">
            {hero.subtitle}
          </p>

          <div className="mt-lg flex items-center justify-center gap-sm flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={(e) => {
                track("request_demo_clicked", { location: "hero" });
                onAnchorClick(e, hero.primaryCtaHref);
              }}
            >
              {hero.primaryCta}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={(e) => {
                track("view_features_clicked", { location: "hero" });
                onAnchorClick(e, hero.secondaryCtaHref);
              }}
            >
              {hero.secondaryCta}
            </Button>
          </div>

          <ul className="mt-md flex items-center justify-center gap-xs flex-wrap">
            {hero.badges.map((b) => (
              <li key={b.label}>
                <Badge variant={badgeVariants[b.tone]}>{b.label}</Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Scroll cue — tells the user there's a demo just below. */}
        <a
          href="#hero-demo"
          onClick={(e) => onAnchorClick(e, "#hero-demo")}
          aria-label={hero.mockup.title}
          className="hidden md:flex absolute bottom-lg left-1/2 -translate-x-1/2 flex-col items-center gap-xs text-stone hover:text-ink transition-colors"
        >
          <span className="text-caption uppercase tracking-wider">
            {hero.mockup.title}
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </section>

      {/* Demo video — pinned scroll track. The tall section gives the sticky
          inner ~one screen of scroll distance, so the video stays put for a
          beat before the page continues to the next section. */}
      <section id="hero-demo" className="relative h-[180vh] bg-canvas">
        <div className="sticky top-[64px] h-[calc(100vh-64px)] flex items-center justify-center px-2xl">
          <div
            ref={cardRef}
            className={
              "w-full max-w-[1080px] transition-all duration-700 ease-out motion-reduce:transition-none " +
              (revealed
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 motion-reduce:opacity-100 motion-reduce:scale-100")
            }
          >
            <HeroVideo title={hero.mockup.title} />
          </div>
        </div>
      </section>
    </>
  );
}

function HeroVideo({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay-with-sound is blocked by browsers until the page is interacted
  // with. Start muted so it plays, then unmute immediately if the browser
  // allows it — otherwise on the very first user interaction anywhere.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
    const unmute = () => {
      v.muted = false;
      v.volume = 1;
      void v.play().catch(() => {});
      events.forEach((e) => window.removeEventListener(e, unmute));
    };
    v.muted = false;
    void v.play().catch(() => {
      // Blocked — keep playing silently and arm the first-interaction unmute.
      v.muted = true;
      void v.play().catch(() => {});
      events.forEach((e) =>
        window.addEventListener(e, unmute, { passive: true, once: false }),
      );
    });
    return () => events.forEach((e) => window.removeEventListener(e, unmute));
  }, []);

  return (
    <div className="relative mx-auto max-w-[1080px] rounded-xl border border-hairline-strong bg-canvas shadow-elev-4 ring-1 ring-hairline-strong overflow-hidden text-left">
      <div className="flex items-center gap-xs h-9 px-md bg-surface border-b border-hairline-soft">
        <span className="w-3 h-3 rounded-full bg-brand-coral" aria-hidden />
        <span className="w-3 h-3 rounded-full bg-brand-yellow" aria-hidden />
        <span className="w-3 h-3 rounded-full bg-success-accent" aria-hidden />
        <span className="ml-md text-caption text-stone">{title}</span>
      </div>
      {/* Starts muted (so autoplay isn't blocked) and loops forever; the effect
          above unmutes it ASAP. Controls let the visitor re-mute if they want. */}
      <video
        ref={videoRef}
        className="block w-full h-auto bg-surface-soft"
        src="/simulator-example.MP4"
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        aria-label={title}
      />
    </div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
