const stats = [
  { value: "100M+", label: "Users worldwide" },
  { value: "200k", label: "Teams onboarded" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "4.7", label: "Capterra rating" },
];

export function Stats() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-stat-display text-ink font-display">
                {s.value}
              </div>
              <div className="mt-xs text-body-md text-steel">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
