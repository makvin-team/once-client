import { Link } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { StatCard } from "../../components/app/StatCard";
import { StatusPill, statusTone } from "../../components/app/StatusPill";
import { Icon } from "../../components/app/icons";
import { AILogo } from "../../components/ui/AILogo";
import { BrandShader } from "../../components/ui/BrandShader";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../auth/AuthProvider";
import {
  getNotificationsForUser,
  getProgressForUser,
  mockLearningPlans,
  mockModules,
  mockSkillScores,
  mockSkills,
} from "../../data/mock";
import { cn } from "../../lib/cn";

export function LearnerDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const progress = getProgressForUser(user.id);
  const completed = progress.filter((p) => p.status === "completed").length;
  const inProgress = progress.filter((p) => p.status === "in_progress");
  const next = inProgress[0];
  const overall =
    progress.length === 0
      ? 0
      : Math.round(
          progress.reduce((acc, p) => acc + (p.percent ?? 0), 0) /
            progress.length,
        );

  const fraudSkill = mockSkillScores.find(
    (s) => s.userId === user.id && s.skillId === "sk_fraud",
  );
  const fraudScore = fraudSkill?.score ?? 0;

  const notifications = getNotificationsForUser(user.id).slice(0, 3);

  const myPlan = mockLearningPlans.find((p) =>
    progress.some((pr) => pr.planId === p.id),
  );

  return (
    <div className="flex flex-col gap-section-sm">
      <PageHeader
        eyebrow={user.fullName.split(" ")[0]}
        title={`Salom, ${user.fullName.split(" ")[0]} 👋`}
        description="Sizning bugungi o'quv yo'lingiz va keyingi qadamlaringiz."
        actions={
          <Link to="/learner/assistant">
            <Button variant="primary">
              <AILogo size={16} on="primary" />
              <span>AI yordamchidan so'rash</span>
            </Button>
          </Link>
        }
      />

      <div className="grid gap-md md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Umumiy progress"
          value={`${overall}%`}
          delta={{ value: "+12% bu hafta", tone: "positive" }}
        />
        <StatCard
          label="Yakunlangan modullar"
          value={completed}
          hint={`${progress.length} dan`}
        />
        <StatCard
          label="Fraud-awareness score"
          value={fraudScore}
          delta={{
            value: fraudScore >= 70 ? "Yaxshi" : "Mashq kerak",
            tone: fraudScore >= 70 ? "positive" : "negative",
          }}
        />
        <StatCard
          label="Joriy o'quv reja"
          value={myPlan ? myPlan.name.split(" ")[0] : "—"}
          hint={myPlan?.name}
        />
      </div>

      <div className="grid gap-md lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl bg-canvas border border-hairline-soft p-xl">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-heading-4 text-ink font-display">
              Davom ettirayotgan modullar
            </h2>
            <Link
              to="/learner/plans"
              className="text-body-sm-medium text-brand-blue hover:underline"
            >
              Barchasini ko'rish →
            </Link>
          </div>

          <ul className="flex flex-col divide-y divide-hairline-soft">
            {progress.map((pr) => {
              const mod = mockModules.find((m) => m.id === pr.moduleId);
              if (!mod) return null;
              return (
                <li
                  key={pr.id}
                  className="py-md flex items-center gap-md"
                >
                  <span
                    className={cn(
                      "w-9 h-9 rounded-md inline-flex items-center justify-center text-primary pastel",
                      pr.status === "completed"
                        ? "bg-teal-light"
                        : pr.status === "in_progress"
                          ? "bg-brand-yellow"
                          : pr.status === "locked"
                            ? "bg-surface-soft text-stone"
                            : "bg-surface",
                    )}
                  >
                    {pr.status === "completed" ? <Icon.Check /> : <Icon.Book />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-xs">
                      <h3 className="text-body-md-medium text-ink truncate">
                        {mod.name}
                      </h3>
                      <StatusPill
                        label={pr.status.replace("_", " ")}
                        tone={statusTone(pr.status)}
                      />
                    </div>
                    <p className="text-caption text-stone">{mod.description}</p>
                    {pr.percent > 0 && pr.status !== "completed" && (
                      <div className="mt-xs h-1.5 rounded-full bg-hairline-soft overflow-hidden">
                        <div
                          className="h-full bg-brand-blue"
                          style={{ width: `${pr.percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <Link
                    to={
                      pr.status === "locked"
                        ? "#"
                        : `/learner/plans/${pr.planId}/modules/${pr.moduleId}`
                    }
                    className={cn(
                      "text-body-sm-medium text-brand-blue shrink-0",
                      pr.status === "locked" && "text-stone pointer-events-none",
                    )}
                  >
                    {pr.status === "completed"
                      ? "Qayta ko'rish"
                      : pr.status === "locked"
                        ? "Yopiq"
                        : "Davom ettirish →"}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="flex flex-col gap-md">
          {next && (
            <div className="relative rounded-2xl overflow-hidden bg-brand-yellow pastel p-xl">
              <BrandShader className="absolute inset-0 w-full h-full block" />
              <div className="relative z-10">
                <p className="text-micro-uppercase uppercase text-primary/60 mb-xs">
                  Keyingi qadam
                </p>
                <h3 className="text-heading-4 text-primary font-display">
                  {mockModules.find((m) => m.id === next.moduleId)?.name}
                </h3>
                <p className="mt-xs text-body-sm text-primary/80">
                  Sizdan {100 - next.percent}% qoldi. Hozir davom etish vaqti.
                </p>
                <Link
                  to={`/learner/plans/${next.planId}/modules/${next.moduleId}`}
                  className="mt-md inline-block"
                >
                  <Button variant="primary">Davom ettirish</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-canvas border border-hairline-soft p-xl">
            <h3 className="text-heading-5 text-ink font-display mb-md">
              Skill darajangiz
            </h3>
            <ul className="flex flex-col gap-sm">
              {mockSkillScores
                .filter((s) => s.userId === user.id)
                .map((s) => {
                  const skill = mockSkills.find((sk) => sk.id === s.skillId);
                  return (
                    <li key={s.id}>
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-charcoal">{skill?.name}</span>
                        <span className="text-ink font-medium">{s.score}</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-hairline-soft overflow-hidden">
                        <div
                          className={cn(
                            "h-full",
                            s.score >= 70 ? "bg-success-accent" : "bg-brand-coral",
                          )}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </aside>
      </div>

      <section className="rounded-2xl bg-canvas border border-hairline-soft p-xl">
        <div className="flex items-center justify-between mb-md">
          <h2 className="text-heading-4 text-ink font-display">Bildirishnomalar</h2>
          <Link
            to="/learner/notifications"
            className="text-body-sm-medium text-brand-blue hover:underline"
          >
            Hammasi
          </Link>
        </div>
        <ul className="flex flex-col divide-y divide-hairline-soft">
          {notifications.map((n) => (
            <li key={n.id} className="py-sm flex items-start gap-md">
              <span
                className={cn(
                  "mt-1 inline-block w-2 h-2 rounded-full shrink-0",
                  n.read ? "bg-hairline-strong" : "bg-brand-blue",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-body-md-medium text-ink">{n.title}</p>
                <p className="text-caption text-stone">{n.body}</p>
              </div>
              <span className="text-caption text-stone shrink-0">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
