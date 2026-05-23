import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";

const toneToBadge = {
  yellow: "tag-yellow",
  coral: "tag-coral",
  teal: "tag-teal",
  rose: "tag-purple",
  canvas: "tag-purple",
} as const;

const toneToCard = {
  yellow: "yellow",
  coral: "coral",
  teal: "teal",
  rose: "rose",
  canvas: "canvas",
} as const;

export function Features() {
  const t = useT();
  const f = t.features;
  return (
    <section id="features" className="bg-surface-soft scroll-mt-[80px]">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <SectionHeader eyebrow={f.eyebrow} title={f.title} subtitle={f.subtitle} />

        <div className="mt-section grid gap-xl md:grid-cols-2 xl:grid-cols-3">
          {f.items.map((item) => (
            <Card key={item.title} tone={toneToCard[item.tone]}>
              <Badge variant={toneToBadge[item.tone]}>{item.badge}</Badge>
              <h3 className="mt-md text-heading-3 text-primary">{item.title}</h3>
              <p className="mt-sm text-body-md text-charcoal max-w-[420px]">
                {item.body}
              </p>
              <ul className="mt-md flex flex-col gap-xs">
                {item.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-xs text-body-sm text-charcoal"
                  >
                    <Dot />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span
      className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0"
      aria-hidden
    />
  );
}
