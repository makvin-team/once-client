import { SectionHeader } from "../ui/SectionHeader";
import { useT } from "../../i18n";

const stepTones = [
  "bg-brand-yellow",
  "bg-coral-light",
  "bg-teal-light",
  "bg-rose-light",
];

export function HowItWorks() {
  const t = useT();
  const h = t.howItWorks;
  return (
    <section id="how" className="bg-canvas scroll-mt-[80px]">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <SectionHeader eyebrow={h.eyebrow} title={h.title} align="center" />

        <ol className="mt-section grid gap-xl md:grid-cols-2 xl:grid-cols-4">
          {h.steps.map((step, i) => (
            <li
              key={step.step}
              className="rounded-3xl border border-hairline-soft bg-canvas p-2xl flex flex-col gap-md"
            >
              <span
                className={`inline-flex items-center justify-center h-12 w-12 rounded-full text-primary font-display text-heading-5 ${stepTones[i]}`}
                aria-hidden
              >
                {step.step}
              </span>
              <h3 className="text-heading-4 text-ink">{step.title}</h3>
              <p className="text-body-md text-slate">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
