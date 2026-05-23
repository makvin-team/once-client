import { useState } from "react";
import { SectionHeader } from "../ui/SectionHeader";
import { cn } from "../../lib/cn";
import { useT } from "../../i18n";
import { track } from "../../lib/analytics";

export function Faq() {
  const t = useT();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(0);

  function toggle(i: number, q: string) {
    setOpen((cur) => {
      const next = cur === i ? null : i;
      if (next === i) track("faq_opened", { question: q });
      return next;
    });
  }

  return (
    <section id="faq" className="bg-surface-soft scroll-mt-[80px]">
      <div className="mx-auto max-w-container px-2xl py-section-lg max-w-[920px]">
        <SectionHeader eyebrow={f.eyebrow} title={f.title} align="center" />

        <div className="mt-section rounded-xl border border-hairline bg-canvas overflow-hidden">
          {f.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-trigger-${i}`;
            return (
              <div
                key={item.q}
                className="border-b border-hairline last:border-b-0"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i, item.q)}
                    className="w-full flex items-center justify-between gap-md p-xl text-left text-heading-5 text-ink hover:bg-surface-soft transition-colors"
                  >
                    <span>{item.q}</span>
                    <span
                      className={cn(
                        "text-stat-display leading-none w-6 h-6 flex items-center justify-center text-slate transition-transform shrink-0",
                        isOpen && "rotate-45",
                      )}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-xl pb-xl text-body-md text-slate"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
