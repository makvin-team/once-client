import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";
import { useInView } from "../../lib/useInView";
import { track } from "../../lib/analytics";

const toneToCard = {
  coral: "coral",
  yellow: "yellow",
  teal: "teal",
  rose: "rose",
  orange: "orange",
  canvas: "canvas",
} as const;

export function Fraud() {
  const t = useT();
  const f = t.fraud;
  const ref = useInView(() => track("fraud_section_viewed"));

  return (
    <section
      id="fraud"
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-canvas scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <div className="flex items-center gap-xs mb-md">
          <Badge variant="tag-coral">Risk</Badge>
          <Badge variant="tag-purple">Compliance</Badge>
        </div>
        <SectionHeader title={f.title} subtitle={f.subtitle} />

        <div className="mt-section grid gap-section lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-md sm:grid-cols-2">
            {f.scenarios.map((s) => (
              <Card key={s.title} tone={toneToCard[s.tone]} size="base">
                <h3 className="text-heading-5 text-primary">{s.title}</h3>
                <p className="mt-xs text-body-md text-charcoal">{s.body}</p>
              </Card>
            ))}
          </div>

          <aside className="rounded-3xl bg-primary text-on-primary p-2xl">
            <p className="text-micro-uppercase uppercase text-on-dark-muted mb-md">
              {f.capsEyebrow}
            </p>
            <h3 className="text-heading-3 text-on-primary font-display">
              {f.capsTitle}
            </h3>
            <ul className="mt-xl flex flex-col gap-md">
              {f.aiCapabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-start gap-sm text-body-md text-on-dark"
                >
                  <Check />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="mt-[3px] text-success-accent shrink-0"
      aria-hidden
    >
      <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M5 9.5L8 12L13 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
