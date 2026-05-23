import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { StatusPill, statusTone } from "../../components/app/StatusPill";
import { Icon } from "../../components/app/icons";
import { useAuth } from "../../auth/AuthProvider";
import {
  getPlanById,
  getProgressForUser,
  mockModules,
} from "../../data/mock";
import { cn } from "../../lib/cn";

export function LearnerPlanDetail() {
  const { user } = useAuth();
  const { planId } = useParams();
  if (!user || !planId) return null;

  const plan = getPlanById(planId);
  if (!plan) return <PageHeader title="Reja topilmadi" />;

  const progress = getProgressForUser(user.id).filter(
    (p) => p.planId === planId,
  );

  return (
    <div>
      <PageHeader
        eyebrow="O'quv reja"
        title={plan.name}
        description={plan.description}
      />

      <ol className="flex flex-col gap-md">
        {plan.moduleIds.map((moduleId, i) => {
          const mod = mockModules.find((m) => m.id === moduleId);
          const pr = progress.find((p) => p.moduleId === moduleId);
          if (!mod) return null;
          const locked = pr?.status === "locked";
          return (
            <li
              key={moduleId}
              className={cn(
                "rounded-2xl border bg-canvas p-xl flex items-center gap-md",
                locked ? "border-hairline-soft opacity-60" : "border-hairline-soft",
              )}
            >
              <span
                className={cn(
                  "w-10 h-10 rounded-full text-primary inline-flex items-center justify-center text-body-md-medium pastel",
                  pr?.status === "completed"
                    ? "bg-teal-light"
                    : pr?.status === "in_progress"
                      ? "bg-brand-yellow"
                      : "bg-surface",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-xs">
                  <h3 className="text-heading-5 text-ink">{mod.name}</h3>
                  {pr && (
                    <StatusPill
                      label={pr.status.replace("_", " ")}
                      tone={statusTone(pr.status)}
                    />
                  )}
                </div>
                <p className="text-body-sm text-slate">{mod.description}</p>
                <p className="mt-xs text-caption text-stone">
                  {mod.lessonIds.length} dars
                  {mod.quizIds.length > 0 && ` · ${mod.quizIds.length} quiz`}
                  {mod.fraudScenarioIds && mod.fraudScenarioIds.length > 0 &&
                    ` · ${mod.fraudScenarioIds.length} fraud scenariy`}
                </p>
              </div>
              <Link
                to={
                  locked
                    ? "#"
                    : `/learner/plans/${planId}/modules/${moduleId}`
                }
                className={cn(
                  "text-body-sm-medium",
                  locked
                    ? "text-stone pointer-events-none"
                    : "text-brand-blue hover:underline",
                )}
              >
                {pr?.status === "completed"
                  ? "Qayta ko'rish"
                  : locked
                    ? <span className="inline-flex items-center gap-xs"><Icon.Shield /> Yopiq</span>
                    : "Boshlash →"}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
