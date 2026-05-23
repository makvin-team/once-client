import { Link, useParams } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { Icon } from "../../components/app/icons";
import { getModuleById, mockLessons } from "../../data/mock";
import { cn } from "../../lib/cn";

const KIND_LABEL: Record<string, string> = {
  text: "Matn",
  pdf: "PDF",
  video: "Video",
  presentation: "Prezentatsiya",
  checklist: "Checklist",
  quiz: "Quiz",
  interactive: "Interactive",
  simulator: "Simulator",
};

export function LearnerModuleDetail() {
  const { planId, moduleId } = useParams();
  if (!planId || !moduleId) return null;
  const mod = getModuleById(moduleId);
  if (!mod) return <PageHeader title="Modul topilmadi" />;

  const lessons = mod.lessonIds
    .map((id) => mockLessons.find((l) => l.id === id))
    .filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <div>
      <PageHeader
        eyebrow="Modul"
        title={mod.name}
        description={mod.description}
      />

      <div className="grid gap-md md:grid-cols-[2fr_1fr]">
        <ol className="flex flex-col gap-xs">
          {lessons.map((l) => (
            <li key={l.id}>
              <Link
                to={`/learner/plans/${planId}/modules/${moduleId}/lessons/${l.id}`}
                className={cn(
                  "flex items-center gap-md p-md rounded-xl border border-hairline-soft bg-canvas",
                  "hover:border-hairline-strong transition-colors",
                )}
              >
                <span className="w-9 h-9 rounded-md bg-surface text-ink inline-flex items-center justify-center">
                  <Icon.Book />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-body-md-medium text-ink truncate">{l.title}</h3>
                  <p className="text-caption text-stone">
                    {KIND_LABEL[l.kind] ?? l.kind}
                    {l.estimatedMinutes && ` · ${l.estimatedMinutes} daq`}
                  </p>
                </div>
                <span className="text-body-sm-medium text-brand-blue">Ochish →</span>
              </Link>
            </li>
          ))}
        </ol>

        <aside className="rounded-2xl bg-surface-pricing-featured pastel p-xl">
          <p className="text-micro-uppercase uppercase text-primary/60 mb-xs">
            Eslatma
          </p>
          <h3 className="text-heading-5 text-primary font-display">
            Modul yakunida nima bo'ladi
          </h3>
          <ul className="mt-md flex flex-col gap-xs text-body-sm text-primary">
            <li>✓ Quiz yoki assessment topshirasiz</li>
            <li>✓ Score saqlanadi va HR'ga ko'rinadi</li>
            <li>✓ Keyingi modul avtomatik ochiladi</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
