import { Button } from "../ui/Button";
import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";
import { onAnchorClick } from "../../lib/scroll";
import { track } from "../../lib/analytics";

export function PilotPlan() {
  const t = useT();
  const p = t.pilot;
  return (
    <section id="pilot" className="bg-canvas scroll-mt-[80px]">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <SectionHeader eyebrow={p.eyebrow} title={p.title} />

        <div className="mt-section grid gap-xl md:grid-cols-2">
          <ChecklistCard tone="yellow" title={p.scope.title} items={p.scope.items} />
          <ChecklistCard
            tone="teal"
            title={p.outcomes.title}
            items={p.outcomes.items}
          />
        </div>

        <div className="mt-section text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={(e) => {
              track("request_demo_clicked", { location: "pilot" });
              onAnchorClick(e, "#demo");
            }}
          >
            {p.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}

function ChecklistCard({
  tone,
  title,
  items,
}: {
  tone: "yellow" | "teal";
  title: string;
  items: ReadonlyArray<string>;
}) {
  const bg = tone === "yellow" ? "bg-brand-yellow" : "bg-teal-light";
  return (
    <div className={`rounded-3xl ${bg} p-2xl pastel`}>
      <h3 className="text-heading-3 text-primary font-display">{title}</h3>
      <ul className="mt-md flex flex-col gap-sm">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-sm text-body-md text-primary"
          >
            <span
              className="mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary text-caption-bold shrink-0"
              aria-hidden
            >
              ✓
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
