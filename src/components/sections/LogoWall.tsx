const logos = [
  "ATLAS",
  "Nimbus",
  "Helix",
  "Quartz",
  "Northwind",
  "Lumen",
  "Orbital",
];

export function LogoWall() {
  return (
    <section className="bg-canvas border-y border-hairline-soft">
      <div className="mx-auto max-w-container px-2xl py-section">
        <p className="text-center text-body-sm-medium text-steel mb-xl">
          Trusted by 200,000+ teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-section gap-y-md">
          {logos.map((l) => (
            <span
              key={l}
              className="text-body-md-medium text-steel tracking-wide opacity-80"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
