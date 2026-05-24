import { Link } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { Icon } from "../../components/app/icons";
import { useTheoryCourse } from "../../data/theoryCourse";
import { cn } from "../../lib/cn";

// Theory Mode landing — the readable counterpart to the 3D Simulator.
// Each card opens a pillar (AML / Cyber / Fraud / CX) which in turn lists
// the five modules that mirror the simulator's scenarios. All copy comes
// from the active-locale dictionary via useTheoryCourse().

export function LearnerPlans() {
  const { pillars, ui } = useTheoryCourse();

  return (
    <div>
      <PageHeader
        eyebrow={ui.eyebrow}
        title={ui.pageTitle}
        description={ui.pageDescription}
      />

      <div className="grid gap-md md:grid-cols-2">
        {pillars.map((pillar) => {
          const totalMinutes = pillar.modules.reduce(
            (acc, m) => acc + m.durationMinutes,
            0,
          );
          return (
            <Link
              key={pillar.id}
              to={`/learner/plans/${pillar.id}`}
              className={cn(
                "group rounded-2xl border border-hairline-soft bg-canvas p-xl",
                "hover:border-hairline-strong transition-colors flex flex-col gap-md",
              )}
            >
              <div className="flex items-center gap-xs">
                <span
                  className={cn(
                    "inline-flex items-center px-xs py-[2px] rounded-full text-caption-bold pastel",
                    pillar.accent.chip,
                    pillar.accent.chipText,
                  )}
                >
                  {ui.pillarLabel} {pillar.priority}
                </span>
                <span className="text-caption text-stone">
                  {ui.modulesCount(pillar.modules.length, totalMinutes)}
                </span>
              </div>

              <div>
                <h2 className="text-heading-3 text-ink font-display">
                  {pillar.title}
                </h2>
                <p className="text-body-sm-medium text-steel mt-xxs">
                  {pillar.subtitle}
                </p>
              </div>

              <p className="text-body-md text-slate">{pillar.description}</p>

              <div className="mt-auto pt-md flex items-center justify-between">
                <ul className="flex flex-wrap gap-xs">
                  {pillar.modules.slice(0, 3).map((m) => (
                    <li
                      key={m.id}
                      className="inline-flex items-center gap-xs px-xs py-1 rounded-md text-caption bg-surface text-charcoal"
                    >
                      <Icon.Book />
                      <span className="max-w-[150px] truncate">
                        {m.title.split(" · ")[0]}
                      </span>
                    </li>
                  ))}
                  {pillar.modules.length > 3 && (
                    <li className="inline-flex items-center px-xs py-1 rounded-md text-caption bg-surface text-stone">
                      +{pillar.modules.length - 3}
                    </li>
                  )}
                </ul>
                <span className="text-body-sm-medium text-brand-blue group-hover:translate-x-0.5 transition-transform">
                  {ui.open} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
