import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { Icon } from "../../components/app/icons";
import { useTheoryCourse } from "../../data/theoryCourse";
import { cn } from "../../lib/cn";

// Pillar detail — lists the 5 modules in a pillar. Each module maps 1:1
// to a simulator scenario; clicking one opens the readable theory lesson.

export function LearnerPlanDetail() {
  const { planId } = useParams();
  const { getPillar, ui } = useTheoryCourse();
  const pillar = getPillar(planId);

  if (!pillar) {
    return (
      <div>
        <PageHeader
          eyebrow={ui.eyebrow}
          title={ui.pillarNotFoundTitle}
          description={ui.pillarNotFoundDescription}
        />
        <Link
          to="/learner/plans"
          className="text-body-sm-medium text-brand-blue hover:underline"
        >
          ← {ui.backToPillars}
        </Link>
      </div>
    );
  }

  const totalMinutes = pillar.modules.reduce(
    (acc, m) => acc + m.durationMinutes,
    0,
  );

  return (
    <div>
      <div className="text-caption text-stone flex items-center gap-xs mb-md">
        <Link to="/learner/plans" className="hover:text-ink">
          {ui.breadcrumbRoot}
        </Link>
        <span>/</span>
        <span className="text-ink">{pillar.title}</span>
      </div>

      <PageHeader
        eyebrow={ui.pillarSubtitleLine(pillar.priority, pillar.subtitle)}
        title={pillar.title}
        description={pillar.description}
      />

      <div className="grid gap-md md:grid-cols-[2fr_1fr]">
        <ol className="flex flex-col gap-md">
          {pillar.modules.map((mod, i) => (
            <li key={mod.id}>
              <Link
                to={`/learner/plans/${pillar.id}/modules/${mod.id}`}
                className={cn(
                  "rounded-2xl border border-hairline-soft bg-canvas p-xl",
                  "flex items-center gap-md",
                  "hover:border-hairline-strong transition-colors",
                )}
              >
                <span
                  className={cn(
                    "w-10 h-10 rounded-full inline-flex items-center justify-center text-body-md-medium pastel shrink-0",
                    pillar.accent.chip,
                    pillar.accent.chipText,
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-heading-5 text-ink truncate">
                    {mod.title}
                  </h3>
                  <p className="text-body-sm text-slate">{mod.subtitle}</p>
                  <p className="mt-xs text-caption text-stone">
                    {ui.moduleMeta(mod.durationMinutes, mod.indicators.length)}
                  </p>
                </div>
                <span className="text-body-sm-medium text-brand-blue shrink-0">
                  {ui.read} →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <aside
          className={cn(
            "rounded-2xl pastel p-xl flex flex-col gap-md",
            pillar.accent.surface,
          )}
        >
          <div>
            <p className="text-micro-uppercase uppercase text-primary/60 mb-xs">
              {ui.aboutPillar}
            </p>
            <h3 className="text-heading-5 text-primary font-display">
              {ui.pillarSummary(pillar.title, pillar.modules.length)}
            </h3>
          </div>

          <ul className="flex flex-col gap-xs text-body-sm text-primary/90">
            <li className="flex items-center gap-xs">
              <Icon.Book />
              <span>{ui.aboutPillarLessons(pillar.modules.length)}</span>
            </li>
            <li className="flex items-center gap-xs">
              <Icon.Clipboard />
              <span>{ui.aboutPillarMinutes(totalMinutes)}</span>
            </li>
            <li className="flex items-center gap-xs">
              <Icon.Play />
              <span>{ui.aboutPillarMaps}</span>
            </li>
          </ul>

          <div className="pt-md border-t border-primary/15">
            <p className="text-caption text-primary/80">
              {ui.aboutPillarFooter}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
