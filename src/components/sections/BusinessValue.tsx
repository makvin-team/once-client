import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";
import { useInView } from "../../lib/useInView";
import { track } from "../../lib/analytics";

export function BusinessValue() {
  const t = useT();
  const v = t.businessValue;
  const ref = useInView(() => track("business_value_section_viewed"));

  return (
    <section
      id="value"
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-surface-soft scroll-mt-[80px]"
    >
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <SectionHeader
          eyebrow={v.eyebrow}
          title={v.title}
          subtitle={v.subtitle}
          align="center"
        />

        <div className="mt-section grid gap-md md:grid-cols-2 lg:grid-cols-4">
          {v.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-canvas border border-hairline-soft p-xl text-center"
            >
              <div className="text-stat-display font-display text-ink">
                {s.value}
              </div>
              <div className="mt-xs text-body-sm text-steel">{s.label}</div>
            </div>
          ))}
        </div>

        <ul className="mt-section grid gap-md md:grid-cols-2 lg:grid-cols-4">
          {v.items.map((item) => (
            <li
              key={item}
              className="rounded-xl bg-canvas border border-hairline-soft p-md flex items-start gap-sm text-body-md text-charcoal"
            >
              <span
                className="mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-yellow text-primary text-caption-bold shrink-0"
                aria-hidden
              >
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
