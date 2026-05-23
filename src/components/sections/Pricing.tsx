import { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";

type Cycle = "monthly" | "annual";

type Tier = {
  name: string;
  price: { monthly: string; annual: string };
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  enterprise?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    cadence: "Free forever",
    description: "For individuals exploring the canvas.",
    features: ["3 editable boards", "Core templates", "Basic AI assist"],
    cta: "Sign up free",
  },
  {
    name: "Starter",
    price: { monthly: "$8", annual: "$6" },
    cadence: "per user / month",
    description: "For small teams shipping together.",
    features: ["Unlimited boards", "Voting & timer", "Team library"],
    cta: "Try Starter",
  },
  {
    name: "Business",
    price: { monthly: "$16", annual: "$12" },
    cadence: "per user / month",
    description: "Advanced collaboration for fast-growing teams.",
    features: ["SSO + SCIM", "AI Workflows", "Private workspaces"],
    cta: "Try Business",
    featured: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Talk", annual: "Talk" },
    cadence: "Custom pricing",
    description: "For organizations with security & scale needs.",
    features: ["Enterprise SSO", "Audit logs", "Dedicated CSM"],
    cta: "Contact sales",
    enterprise: true,
  },
];

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("annual");

  return (
    <section id="pricing" className="bg-surface">
      <div className="mx-auto max-w-container px-2xl py-section-lg">
        <div className="text-center max-w-[760px] mx-auto">
          <p className="text-micro-uppercase uppercase text-steel mb-md">
            Pricing
          </p>
          <h2 className="text-heading-2 md:text-heading-1 text-ink font-display">
            Pick the plan that scales with your team.
          </h2>
          <p className="mt-md text-subtitle text-slate">
            Start free. Upgrade when you outgrow it.
          </p>
        </div>

        <div className="mt-2xl flex items-center justify-center">
          <div className="bg-canvas border border-hairline rounded-full p-1 inline-flex items-center gap-1">
            {(["monthly", "annual"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={cn(
                  "px-md py-xs rounded-full text-body-sm-medium transition-colors",
                  cycle === c
                    ? "bg-primary text-on-primary"
                    : "text-charcoal hover:text-ink",
                )}
              >
                {c === "monthly" ? "Monthly" : "Annual"}
                {c === "annual" && (
                  <Badge variant="discount" className="ml-xs">
                    -25%
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-section grid gap-lg md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={cn(
                "rounded-xl p-2xl flex flex-col gap-md",
                t.enterprise
                  ? "bg-primary text-on-primary"
                  : t.featured
                    ? "bg-surface-pricing-featured border-2 border-brand-blue"
                    : "bg-canvas border border-hairline",
              )}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "text-heading-4",
                    t.enterprise ? "text-on-primary" : "text-ink",
                  )}
                >
                  {t.name}
                </h3>
                {t.featured && (
                  <Badge variant="tag-purple">Most popular</Badge>
                )}
              </div>
              <p
                className={cn(
                  "text-body-sm",
                  t.enterprise ? "text-on-dark-muted" : "text-slate",
                )}
              >
                {t.description}
              </p>
              <div className="mt-xs">
                <div
                  className={cn(
                    "text-heading-1 font-display",
                    t.enterprise ? "text-on-primary" : "text-ink",
                  )}
                >
                  {t.price[cycle]}
                </div>
                <div
                  className={cn(
                    "text-body-sm mt-xxs",
                    t.enterprise ? "text-on-dark-muted" : "text-steel",
                  )}
                >
                  {t.cadence}
                </div>
              </div>

              <Button
                variant={
                  t.enterprise ? "on-dark" : t.featured ? "blue" : "primary"
                }
                size="lg"
              >
                {t.cta}
              </Button>

              <ul className="mt-md flex flex-col gap-xs">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className={cn(
                      "flex items-start gap-xs text-body-sm",
                      t.enterprise ? "text-on-dark" : "text-charcoal",
                    )}
                  >
                    <Check
                      className={cn(
                        "mt-0.5",
                        t.enterprise
                          ? "text-success-accent"
                          : "text-brand-blue",
                      )}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M3 8.5L6.5 12L13 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
