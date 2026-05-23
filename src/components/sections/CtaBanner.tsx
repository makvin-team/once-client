import { Button } from "../ui/Button";

export function CtaBanner() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-container px-2xl pb-section-lg">
        <div className="rounded-feature bg-primary text-on-primary px-2xl py-section text-center">
          <h2 className="text-heading-1 md:text-display-lg font-display text-on-primary">
            Ready to do great work?
          </h2>
          <p className="mt-md text-subtitle text-on-dark-muted max-w-[560px] mx-auto">
            Spin up your first board in 30 seconds. No card required.
          </p>
          <div className="mt-2xl flex items-center justify-center gap-sm flex-wrap">
            <Button variant="on-dark" size="lg">
              Get started free
            </Button>
            <Button variant="ghost" size="lg" className="text-on-dark hover:bg-charcoal">
              Book a demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
