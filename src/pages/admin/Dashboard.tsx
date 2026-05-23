import { Link } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { StatCard } from "../../components/app/StatCard";
import { StatusPill, statusTone } from "../../components/app/StatusPill";
import { Icon } from "../../components/app/icons";
import {
  mockAuditLogs,
  mockBranches,
  mockLearners,
  mockLearningPlans,
  mockSkillScores,
} from "../../data/mock";

export function AdminDashboard() {
  const total = mockLearners.length;
  const active = mockLearners.filter((l) => l.status === "active").length;
  const pending = mockLearners.filter((l) => l.status === "pending").length;
  const blocked = mockLearners.filter((l) => l.status === "blocked").length;

  const publishedPlans = mockLearningPlans.filter(
    (p) => p.status === "published",
  ).length;

  // Mock avg fraud score across learners (use existing skill scores).
  const fraudAvg = Math.round(
    mockSkillScores
      .filter((s) => s.skillId === "sk_fraud")
      .reduce((a, b) => a + b.score, 0) /
      (mockSkillScores.filter((s) => s.skillId === "sk_fraud").length || 1),
  );

  const branchRows = mockBranches.map((b) => {
    const branchLearners = mockLearners.filter((l) => l.branchId === b.id);
    const completed = Math.floor(branchLearners.length * 0.6);
    return {
      id: b.id,
      name: b.name,
      total: branchLearners.length,
      ready: completed,
      percent:
        branchLearners.length === 0
          ? 0
          : Math.round((completed / branchLearners.length) * 100),
    };
  });

  return (
    <div className="flex flex-col gap-section-sm">
      <PageHeader
        eyebrow="Operatsion ko'rinish"
        title="Admin dashboard"
        description="Bank bo'ylab learner faolligi, training progress va fraud awareness."
        actions={
          <Link to="/admin/reports">
            <button className="inline-flex items-center gap-xs h-9 px-md rounded-full border border-hairline-strong bg-canvas text-body-sm-medium text-ink hover:bg-surface">
              <Icon.Chart />
              <span>Hisobotlar</span>
            </button>
          </Link>
        }
      />

      <div className="grid gap-md md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Jami learnerlar"
          value={total}
          delta={{ value: `${pending} pending`, tone: "neutral" }}
        />
        <StatCard
          label="Active"
          value={active}
          hint={`${Math.round((active / total) * 100)}% aktiv`}
        />
        <StatCard
          label="Published o'quv rejalar"
          value={publishedPlans}
          hint={`${mockLearningPlans.length} reja jami`}
        />
        <StatCard
          label="Fraud-awareness o'rtacha"
          value={fraudAvg}
          delta={{
            value: fraudAvg >= 60 ? "Yaxshi" : "Diqqat",
            tone: fraudAvg >= 60 ? "positive" : "negative",
          }}
        />
      </div>

      <div className="grid gap-md lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-hairline-soft bg-canvas p-xl">
          <div className="flex items-center justify-between mb-md">
            <h2 className="text-heading-4 text-ink font-display">
              Filial kesimida tayyorlik
            </h2>
            <Link
              to="/admin/progress"
              className="text-body-sm-medium text-brand-blue hover:underline"
            >
              Batafsil
            </Link>
          </div>
          <ul className="flex flex-col gap-md">
            {branchRows.map((row) => (
              <li key={row.id}>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-charcoal">{row.name}</span>
                  <span className="text-ink font-medium">
                    {row.ready}/{row.total} ·{" "}
                    <span className="text-stone">{row.percent}%</span>
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-hairline-soft overflow-hidden">
                  <div
                    className="h-full bg-brand-blue"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-2xl bg-primary text-on-primary p-xl">
          <p className="text-micro-uppercase uppercase text-on-dark-muted mb-md">
            Eslatma
          </p>
          <h3 className="text-heading-4 text-on-primary font-display">
            12 ta learner sertifikatga bir qadam qoldi
          </h3>
          <p className="mt-xs text-body-sm text-on-dark-muted">
            Bu hafta yakuniga 12 learner barcha modullarni yakunlash bosqichida.
          </p>
          <Link to="/admin/users" className="mt-md inline-block">
            <button className="inline-flex items-center gap-xs h-9 px-md rounded-full bg-on-dark text-primary text-body-sm-medium hover:opacity-90">
              Ro'yxatni ko'rish →
            </button>
          </Link>
        </aside>
      </div>

      <section className="rounded-2xl border border-hairline-soft bg-canvas p-xl">
        <div className="flex items-center justify-between mb-md">
          <h2 className="text-heading-4 text-ink font-display">Oxirgi actionlar</h2>
          <Link
            to="/admin/audit"
            className="text-body-sm-medium text-brand-blue hover:underline"
          >
            Audit logni ochish
          </Link>
        </div>
        <ul className="flex flex-col divide-y divide-hairline-soft">
          {mockAuditLogs.map((log) => (
            <li
              key={log.id}
              className="py-sm flex items-center gap-md text-body-sm"
            >
              <Icon.Audit />
              <div className="flex-1 min-w-0">
                <p className="text-ink">
                  <span className="font-medium">{log.actorName}</span>{" "}
                  <span className="text-stone">{log.action}</span>
                  {log.targetEntity && (
                    <>
                      {" → "}
                      <span className="text-charcoal">
                        {log.targetEntity}:{log.targetId}
                      </span>
                    </>
                  )}
                </p>
                {log.details && (
                  <p className="text-caption text-stone">{log.details}</p>
                )}
              </div>
              <StatusPill label={log.status} tone={statusTone(log.status)} />
              <span className="text-caption text-stone w-[120px] text-right shrink-0">
                {new Date(log.at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-md md:grid-cols-3">
        <QuickTile
          to="/admin/knowledge"
          title="Knowledge base"
          desc="Hujjat yuklash, indexlash va boshqarish"
          tone="yellow"
        />
        <QuickTile
          to="/admin/plans"
          title="O'quv reja yaratish"
          desc="Lavozim va guruhga learning plan tuzish"
          tone="teal"
        />
        <QuickTile
          to="/admin/scenarios/fraud"
          title="Fraud scenariy"
          desc="Phishing, deepfake va shubhali operatsiyalar"
          tone="coral"
        />
      </div>

      <p className="text-caption text-stone">
        Pending: <strong>{pending}</strong> learner approval kutmoqda · Blocked:{" "}
        <strong>{blocked}</strong>
      </p>
    </div>
  );
}

function QuickTile({
  to,
  title,
  desc,
  tone,
}: {
  to: string;
  title: string;
  desc: string;
  tone: "yellow" | "teal" | "coral";
}) {
  const bg =
    tone === "yellow"
      ? "bg-brand-yellow"
      : tone === "teal"
        ? "bg-teal-light"
        : "bg-coral-light";
  return (
    <Link
      to={to}
      className={`rounded-2xl ${bg} pastel p-xl flex flex-col gap-xs hover:opacity-95 transition-opacity`}
    >
      <h3 className="text-heading-5 text-primary font-display">{title}</h3>
      <p className="text-body-sm text-primary/80">{desc}</p>
      <span className="text-body-sm-medium text-primary mt-md">Ochish →</span>
    </Link>
  );
}
