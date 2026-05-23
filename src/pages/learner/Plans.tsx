import { Link } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { StatusPill, statusTone } from "../../components/app/StatusPill";
import { Icon } from "../../components/app/icons";
import { useAuth } from "../../auth/AuthProvider";
import {
  getProgressForUser,
  mockLearningPlans,
  mockModules,
} from "../../data/mock";
import { cn } from "../../lib/cn";

export function LearnerPlans() {
  const { user } = useAuth();
  if (!user) return null;
  const progress = getProgressForUser(user.id);
  const planIds = new Set(progress.map((p) => p.planId));
  const myPlans = mockLearningPlans.filter((p) => planIds.has(p.id));

  return (
    <div>
      <PageHeader
        title="O'quv rejalar"
        description="Sizga biriktirilgan barcha o'quv rejalar. Modul tartibida o'tib boring."
      />

      <div className="grid gap-md md:grid-cols-2">
        {myPlans.map((plan) => {
          const planProgress = progress.filter((p) => p.planId === plan.id);
          const completed = planProgress.filter(
            (p) => p.status === "completed",
          ).length;
          const total = planProgress.length;
          const percent =
            total === 0
              ? 0
              : Math.round(
                  planProgress.reduce((acc, p) => acc + (p.percent ?? 0), 0) /
                    total,
                );
          return (
            <Link
              key={plan.id}
              to={`/learner/plans/${plan.id}`}
              className="rounded-2xl border border-hairline-soft bg-canvas p-xl hover:border-hairline-strong transition-colors"
            >
              <div className="flex items-center gap-xs mb-md">
                <StatusPill
                  label={plan.status}
                  tone={statusTone(plan.status)}
                />
                {plan.deadlineAt && (
                  <span className="text-caption text-stone">
                    deadline {new Date(plan.deadlineAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h2 className="text-heading-4 text-ink font-display">
                {plan.name}
              </h2>
              <p className="mt-xs text-body-md text-slate">{plan.description}</p>
              <div className="mt-md flex items-center gap-md">
                <div className="flex-1 h-2 rounded-full bg-hairline-soft overflow-hidden">
                  <div
                    className="h-full bg-brand-blue"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-body-sm-medium text-ink">{percent}%</span>
              </div>
              <p className="mt-xs text-caption text-stone">
                {completed}/{total} modul yakunlangan
              </p>
              <ModuleStrip planModules={planProgress.map((p) => p.moduleId)} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ModuleStrip({ planModules }: { planModules: string[] }) {
  return (
    <ul className="mt-md flex flex-wrap gap-xs">
      {planModules.map((id) => {
        const mod = mockModules.find((m) => m.id === id);
        return (
          <li
            key={id}
            className={cn(
              "inline-flex items-center gap-xs px-xs py-1 rounded-md text-caption bg-surface text-charcoal",
            )}
          >
            <Icon.Book />
            <span>{mod?.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
