import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { Icon } from "../../components/app/icons";
import {
  useTheoryCourse,
  type Severity,
  type TheoryCourseUiStrings,
} from "../../data/theoryCourse";
import { cn } from "../../lib/cn";

// Theory lesson — the readable form of one simulator scenario. Sections:
//   1. Objective + overview
//   2. Indicators (3-5 red flags the simulator surfaces during inspect)
//   3. The decision: correct / partial / fail with rationale
//   4. Takeaways + references
//   5. Cross-links: previous / next module + back to pillar

const SEVERITY_TONE: Record<
  Severity,
  { chip: string; text: string; dot: string }
> = {
  critical: {
    chip: "bg-coral-light",
    text: "text-coral-dark",
    dot: "bg-brand-coral",
  },
  high: {
    chip: "bg-surface-yellow",
    text: "text-yellow-dark",
    dot: "bg-brand-yellow-deep",
  },
  medium: {
    chip: "bg-surface-pricing-featured",
    text: "text-brand-blue",
    dot: "bg-brand-blue",
  },
  low: {
    chip: "bg-teal-light",
    text: "text-moss-dark",
    dot: "bg-brand-teal",
  },
};

export function LearnerModuleDetail() {
  const { planId, moduleId } = useParams();
  const { getModule, getAdjacentModule, ui } = useTheoryCourse();
  const found = getModule(planId, moduleId);

  if (!found) {
    return (
      <div>
        <PageHeader
          eyebrow={ui.eyebrow}
          title={ui.lessonNotFoundTitle}
          description={ui.lessonNotFoundDescription}
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

  const { pillar, module } = found;
  const prev = getAdjacentModule(pillar.id, module.id, "prev");
  const next = getAdjacentModule(pillar.id, module.id, "next");

  return (
    <div className="max-w-[820px] mx-auto">
      <div className="text-caption text-stone flex items-center gap-xs mb-md">
        <Link to="/learner/plans" className="hover:text-ink">
          {ui.breadcrumbRoot}
        </Link>
        <span>/</span>
        <Link
          to={`/learner/plans/${pillar.id}`}
          className="hover:text-ink"
        >
          {pillar.title}
        </Link>
        <span>/</span>
        <span className="text-ink truncate">
          {module.title.split(" · ")[0]}
        </span>
      </div>

      <PageHeader
        eyebrow={ui.moduleEyebrow(pillar.title, module.durationMinutes)}
        title={module.title}
        description={module.subtitle}
      />

      {/* Objective */}
      <section
        className={cn(
          "rounded-2xl pastel p-xl mb-section-sm",
          pillar.accent.surface,
        )}
      >
        <p className="text-micro-uppercase uppercase text-primary/60 mb-xs">
          {ui.learningObjective}
        </p>
        <p className="text-heading-5 text-primary font-display leading-snug">
          {module.objective}
        </p>
      </section>

      {/* Overview */}
      <section className="mb-section-sm">
        <SectionTitle index="01" title={ui.sectionOverview} />
        <div className="rounded-2xl border border-hairline-soft bg-canvas p-xl">
          <p className="text-body-md text-charcoal leading-relaxed">
            {module.overview}
          </p>
        </div>
      </section>

      {/* Indicators */}
      <section className="mb-section-sm">
        <SectionTitle index="02" title={ui.sectionIndicators} />
        <ul className="flex flex-col gap-md">
          {module.indicators.map((ind) => {
            const tone = SEVERITY_TONE[ind.severity];
            return (
              <li
                key={ind.label}
                className="rounded-2xl border border-hairline-soft bg-canvas p-xl"
              >
                <div className="flex items-start gap-md">
                  <span
                    className={cn(
                      "mt-1 w-2.5 h-2.5 rounded-full shrink-0",
                      tone.dot,
                    )}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-xs flex-wrap">
                      <h3 className="text-body-md-medium text-ink">
                        {ind.label}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex items-center px-xs py-[2px] rounded-full text-caption-bold pastel",
                          tone.chip,
                          tone.text,
                        )}
                      >
                        {ui.severity[ind.severity]}
                      </span>
                    </div>
                    <p className="mt-xs text-body-sm text-slate leading-relaxed">
                      {ind.detail}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Decision */}
      <section className="mb-section-sm">
        <SectionTitle index="03" title={ui.sectionDecision} />
        <div className="flex flex-col gap-md">
          <DecisionCard
            outcome="correct"
            points="+10"
            action={module.correctAction}
            ui={ui}
          />
          <DecisionCard
            outcome="partial"
            points="+6"
            action={module.partialAction}
            ui={ui}
          />
          <DecisionCard
            outcome="fail"
            points="0"
            action={module.failAction}
            ui={ui}
          />
        </div>
      </section>

      {/* Takeaways */}
      <section className="mb-section-sm">
        <SectionTitle index="04" title={ui.sectionTakeaways} />
        <ul className="rounded-2xl border border-hairline-soft bg-canvas p-xl flex flex-col gap-sm">
          {module.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-md">
              <span className="mt-1 text-success-accent shrink-0">
                <Icon.Check />
              </span>
              <p className="text-body-md text-charcoal">{t}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* References */}
      {module.references && module.references.length > 0 && (
        <section className="mb-section-sm">
          <SectionTitle index="05" title={ui.sectionReferences} />
          <ul className="flex flex-col gap-xs">
            {module.references.map((r) => (
              <li
                key={r}
                className="flex items-center gap-xs text-body-sm text-slate"
              >
                <Icon.Doc />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer nav */}
      <nav className="mt-section flex items-center justify-between gap-md border-t border-hairline-soft pt-xl">
        {prev ? (
          <Link
            to={`/learner/plans/${prev.pillarId}/modules/${prev.moduleId}`}
            className="text-body-sm-medium text-steel hover:text-ink"
          >
            {ui.previousModule}
          </Link>
        ) : (
          <span />
        )}
        <Link
          to={`/learner/plans/${pillar.id}`}
          className="text-body-sm-medium text-steel hover:text-ink"
        >
          {ui.allPillarModules(pillar.title)}
        </Link>
        {next ? (
          <Link
            to={`/learner/plans/${next.pillarId}/modules/${next.moduleId}`}
            className="text-body-sm-medium text-brand-blue hover:underline"
          >
            {ui.nextModule}
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-md mb-md">
      <span className="text-micro-uppercase uppercase text-stone">{index}</span>
      <h2 className="text-heading-4 text-ink font-display">{title}</h2>
    </div>
  );
}

type DecisionCardProps = {
  outcome: "correct" | "partial" | "fail";
  points: string;
  action: { label: string; rationale: string };
  ui: TheoryCourseUiStrings;
};

function DecisionCard({ outcome, points, action, ui }: DecisionCardProps) {
  const styles = {
    correct: {
      border: "border-success-accent/40",
      surface: "bg-success-accent/5",
      chip: "bg-success-accent/15 text-success-accent",
      label: ui.decisionCorrect,
    },
    partial: {
      border: "border-brand-yellow/50",
      surface: "bg-surface-yellow",
      chip: "bg-surface-yellow text-yellow-dark",
      label: ui.decisionPartial,
    },
    fail: {
      border: "border-brand-coral/40",
      surface: "bg-coral-light",
      chip: "bg-coral-light text-coral-dark",
      label: ui.decisionFail,
    },
  }[outcome];

  return (
    <div
      className={cn(
        "rounded-2xl border bg-canvas p-xl pastel",
        styles.border,
      )}
    >
      <div className="flex items-center gap-xs mb-sm">
        <span
          className={cn(
            "inline-flex items-center px-xs py-[2px] rounded-full text-caption-bold",
            styles.chip,
          )}
        >
          {styles.label}
        </span>
        <span className="text-caption text-stone">{ui.pointsLabel(points)}</span>
      </div>
      <h3 className="text-heading-5 text-ink font-display">{action.label}</h3>
      <p className="mt-xs text-body-md text-charcoal leading-relaxed">
        {action.rationale}
      </p>
    </div>
  );
}
