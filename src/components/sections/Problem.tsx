import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";

const toneToCardTone = {
  canvas: "canvas",
  yellow: "yellow",
  coral: "coral",
  rose: "rose",
} as const;

export function Problem() {
  const t = useT();
  const p = t.problem;
  return (
    <section id="problem" className="bg-surface-soft scroll-mt-[80px]">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <SectionHeader eyebrow={p.eyebrow} title={p.title} subtitle={p.subtitle} />

        <div className="mt-section grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {p.items.map((item) => (
            <Card
              key={item.title}
              tone={toneToCardTone[item.tone]}
              size="base"
              className="h-full"
            >
              <h3 className="text-heading-5 text-primary">{item.title}</h3>
              <p className="mt-xs text-body-md text-charcoal">{item.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
