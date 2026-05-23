type Story = {
  tone: "yellow" | "coral" | "teal" | "rose";
  brand: string;
  metric: string;
  quote: string;
};

const stories: Story[] = [
  {
    tone: "yellow",
    brand: "ATLAS",
    metric: "3× faster planning cycles",
    quote: "We replaced six meetings with one Once board.",
  },
  {
    tone: "coral",
    brand: "Nimbus",
    metric: "$1.2M saved annually",
    quote: "Our entire roadmap lives on one canvas now.",
  },
  {
    tone: "teal",
    brand: "Helix",
    metric: "+42% in design throughput",
    quote: "Design + product finally share the same room.",
  },
];

const toneBg: Record<Story["tone"], string> = {
  yellow: "bg-brand-yellow",
  coral: "bg-coral-light",
  teal: "bg-teal-light",
  rose: "bg-rose-light",
};

export function CustomerStories() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-2xl">
          <div className="max-w-[640px]">
            <p className="text-micro-uppercase uppercase text-steel mb-md">
              Customer stories
            </p>
            <h2 className="text-heading-2 md:text-heading-1 text-ink font-display">
              Teams everywhere ship faster with Once.
            </h2>
          </div>
          <a
            href="#"
            className="text-body-sm-medium text-brand-blue hover:underline self-start md:self-auto"
          >
            See all stories →
          </a>
        </div>

        <div className="grid gap-xl md:grid-cols-3">
          {stories.map((s) => (
            <article
              key={s.brand}
              className="rounded-3xl border border-hairline-soft overflow-hidden bg-canvas flex flex-col"
            >
              <div className={`p-2xl ${toneBg[s.tone]} aspect-[4/3] flex flex-col justify-between`}>
                <div className="text-body-md-medium text-primary">{s.brand}</div>
                <div className="text-heading-3 font-display text-primary">
                  {s.metric}
                </div>
              </div>
              <div className="p-2xl">
                <p className="text-body-md text-charcoal">"{s.quote}"</p>
                <a
                  href="#"
                  className="mt-md inline-block text-body-sm-medium text-brand-blue hover:underline"
                >
                  Read story →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
