import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";

const toneToCard = {
  yellow: "yellow",
  coral: "coral",
  teal: "teal",
  rose: "rose",
} as const;

export function TargetUsers() {
  const t = useT();
  const u = t.targetUsers;
  return (
    <section className="bg-surface-soft">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <SectionHeader eyebrow={u.eyebrow} title={u.title} />

        <div className="mt-section grid gap-xl md:grid-cols-2 xl:grid-cols-4">
          {u.primary.map((p) => (
            <Card key={p.title} tone={toneToCard[p.tone]}>
              <h3 className="text-heading-4 text-primary">{p.title}</h3>
              <p className="mt-sm text-body-md text-charcoal">{p.body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-section rounded-3xl bg-canvas border border-hairline-soft p-2xl">
          <p className="text-micro-uppercase uppercase text-steel mb-md">
            {u.alsoFor}
          </p>
          <ul className="flex flex-wrap gap-xs">
            {u.extras.map((e) => (
              <li
                key={e}
                className="px-md py-xs rounded-full border border-hairline-strong text-body-sm-medium text-charcoal bg-canvas"
              >
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
