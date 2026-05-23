import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/app/PageHeader";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/app/icons";
import { getLessonById, getModuleById } from "../../data/mock";
import { cn } from "../../lib/cn";

export function LessonViewer() {
  const { planId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (!planId || !moduleId || !lessonId) return null;
  const lesson = getLessonById(lessonId);
  const mod = getModuleById(moduleId);
  if (!lesson || !mod) return <PageHeader title="Dars topilmadi" />;

  function toggleCheck(id: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function markComplete() {
    setCompleted(true);
    setTimeout(() => navigate(`/learner/plans/${planId}/modules/${moduleId}`), 800);
  }

  const breadcrumbs = (
    <div className="text-caption text-stone flex items-center gap-xs mb-md">
      <Link to={`/learner/plans/${planId}`} className="hover:text-ink">
        O'quv reja
      </Link>
      <span>/</span>
      <Link
        to={`/learner/plans/${planId}/modules/${moduleId}`}
        className="hover:text-ink"
      >
        {mod.name}
      </Link>
    </div>
  );

  return (
    <div className="max-w-[760px] mx-auto">
      {breadcrumbs}
      <PageHeader eyebrow="Dars" title={lesson.title} />

      <article className="rounded-2xl bg-canvas border border-hairline-soft p-xl">
        {lesson.kind === "text" && lesson.body && (
          <div className="prose max-w-none text-body-md text-charcoal whitespace-pre-line leading-relaxed">
            {lesson.body}
          </div>
        )}

        {lesson.kind === "video" && lesson.videoUrl && (
          <div className="aspect-video rounded-xl bg-surface flex flex-col items-center justify-center gap-md">
            <Icon.Play />
            <p className="text-body-sm text-stone">
              Video: {lesson.videoUrl}
            </p>
            <p className="text-caption text-stone">
              (haqiqiy embed implementatsiyasi keyingi iteratsiyada)
            </p>
          </div>
        )}

        {lesson.kind === "checklist" && lesson.checklistItems && (
          <ul className="flex flex-col gap-sm">
            {lesson.checklistItems.map((it) => {
              const checked = checkedItems.has(it.id);
              return (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => toggleCheck(it.id)}
                    className={cn(
                      "w-full text-left flex items-start gap-md p-md rounded-xl border transition-colors",
                      checked
                        ? "border-success-accent bg-success-accent/10 pastel"
                        : "border-hairline-soft hover:border-hairline-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 w-5 h-5 rounded border-2 inline-flex items-center justify-center shrink-0",
                        checked
                          ? "border-success-accent bg-success-accent text-on-primary"
                          : "border-hairline-strong",
                      )}
                      aria-hidden
                    >
                      {checked && <Icon.Check />}
                    </span>
                    <span className="text-body-md text-charcoal">{it.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </article>

      <div className="mt-xl flex items-center gap-md">
        {completed ? (
          <div className="flex items-center gap-xs text-success-accent text-body-md-medium">
            <Icon.Check />
            <span>Yakunlandi — modulga qaytarilmoqda…</span>
          </div>
        ) : (
          <Button variant="primary" size="lg" onClick={markComplete}>
            <Icon.Check />
            <span>Mark as completed</span>
          </Button>
        )}
        <Link
          to={`/learner/plans/${planId}/modules/${moduleId}`}
          className="text-body-sm-medium text-steel hover:text-ink"
        >
          ← Modulga qaytish
        </Link>
      </div>
    </div>
  );
}
