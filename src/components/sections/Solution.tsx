import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";

export function Solution() {
  const t = useT();
  const s = t.solution;
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <div className="grid gap-section lg:grid-cols-[1.1fr_1fr] items-start">
          <SectionHeader eyebrow={s.eyebrow} title={s.title} subtitle={s.body} />

          <div className="rounded-3xl bg-surface-pricing-featured p-2xl border border-hairline-soft">
            <ul className="flex flex-col divide-y divide-hairline-soft">
              {s.items.map((item, i) => (
                <li
                  key={item.title}
                  className="py-md first:pt-0 last:pb-0 flex items-start gap-md"
                >
                  <span
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-blue text-on-primary text-body-sm-medium shrink-0"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-heading-5 text-ink">{item.title}</h3>
                    <p className="mt-xxs text-body-md text-slate">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
