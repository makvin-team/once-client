import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../../i18n";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/app/EmptyState";
import { Icon } from "../../components/app/icons";
import { Input } from "../../components/ui/Input";
import { cn } from "../../lib/cn";
import { fraudService, type AdminFraudScenario, type MultiLangValue, type UpdateFraudScenarioPayload } from "../../services/fraud.service";
import type {
  FraudSimDifficulty,
  FraudSimRisk,
  FraudSimScenario,
  FraudSimType,
  RedFlagOption,
  DecisionOption,
} from "../../data/fraudSim";

// ── Labels ───────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<FraudSimType, string> = {
  aml_kyc:            "AML / Compliance",
  phishing:           "Cybersecurity",
  transaction:        "Fraud Monitoring",
  social_engineering: "Customer Support",
  deepfake_call:      "Deepfake Call",
  document:           "Document Fraud",
};

const DIFF_LABEL: Record<FraudSimDifficulty, string> = {
  beginner:     "Beginner",
  intermediate: "Intermediate",
  advanced:     "Advanced",
};

const RISK_LABEL: Record<FraudSimRisk, string> = {
  low:    "Low",
  medium: "Medium",
  high:   "High",
};

// ── Badge helpers ─────────────────────────────────────────────────────────────

type BadgeVariant = "tag-yellow" | "tag-purple" | "tag-coral" | "tag-teal";

function typeBadge(t: FraudSimType): BadgeVariant {
  return {
    aml_kyc:            "tag-purple",
    phishing:           "tag-coral",
    transaction:        "tag-teal",
    social_engineering: "tag-purple",
    deepfake_call:      "tag-coral",
    document:           "tag-yellow",
  }[t] as BadgeVariant;
}

function diffBadge(d: FraudSimDifficulty): BadgeVariant {
  return { beginner: "tag-teal", intermediate: "tag-yellow", advanced: "tag-coral" }[d] as BadgeVariant;
}

function riskBadge(r: FraudSimRisk): BadgeVariant {
  return { low: "tag-teal", medium: "tag-yellow", high: "tag-coral" }[r] as BadgeVariant;
}

// ── Type options ──────────────────────────────────────────────────────────────

const TYPE_OPTS: Array<{ value: FraudSimType | ""; label: string }> = [
  { value: "", label: "All types" },
  { value: "aml_kyc",            label: "AML / Compliance" },
  { value: "phishing",           label: "Cybersecurity" },
  { value: "transaction",        label: "Fraud Monitoring" },
  { value: "social_engineering", label: "Customer Support" },
  { value: "deepfake_call",      label: "Deepfake Call" },
  { value: "document",           label: "Document Fraud" },
];

const DIFF_OPTS: Array<{ value: FraudSimDifficulty | ""; label: string }> = [
  { value: "",             label: "All levels" },
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
];

const RISK_OPTS: Array<{ value: FraudSimRisk | ""; label: string }> = [
  { value: "",       label: "All risks" },
  { value: "low",    label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high",   label: "High" },
];

// ── Scenario drawer ───────────────────────────────────────────────────────────

type DrawerProps = {
  scenario: FraudSimScenario | null;
  onClose: () => void;
  onUpdated: (s: FraudSimScenario) => void;
};

function ScenarioDrawer({ scenario, onClose, onUpdated }: DrawerProps) {
  const open = scenario !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-primary/30 z-40 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      {/* panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-[560px] bg-canvas shadow-elev-3",
          "flex flex-col transition-transform duration-300 ease-out overflow-hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {scenario && <DrawerContent scenario={scenario} onClose={onClose} onUpdated={onUpdated} />}
      </div>
    </>
  );
}

function DrawerContent({ scenario, onClose, onUpdated }: { scenario: FraudSimScenario; onClose: () => void; onUpdated: (s: FraudSimScenario) => void }) {
  const redFlags = scenario.redFlagOptions as RedFlagOption[];
  const decisions = scenario.decisionOptions as DecisionOption[];
  const correctFlagsCount = redFlags.filter(f => f.correct).length;

  const [editing, setEditing] = useState(false);
  const [loadingLangs, setLoadingLangs] = useState(false); // true while fetching all 4 lang variants
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [form, setForm] = useState<UpdateFraudScenarioPayload>({
    title:            { uz: "", ru: "", en: "", cyrl: "" },
    description:      { uz: "", ru: "", en: "", cyrl: "" },
    learnerRole:      { uz: "", ru: "", en: "", cyrl: "" },
    playUrl:          null,
    estimatedMinutes: 0,
    passScore:        0,
  });

  function startEdit() {
    // Show the form immediately using the currently visible (localized) text as a
    // placeholder, then replace with full multilang data once it loads.
    const cur = scenario.title;
    setForm({
      title:            { uz: cur, ru: cur, en: cur, cyrl: cur },
      description:      { uz: scenario.description, ru: scenario.description, en: scenario.description, cyrl: scenario.description },
      learnerRole:      { uz: scenario.learnerRole, ru: scenario.learnerRole, en: scenario.learnerRole, cyrl: scenario.learnerRole },
      playUrl:          scenario.playUrl ?? null,
      estimatedMinutes: scenario.estimatedMinutes,
      passScore:        scenario.passScore,
    });
    setEditing(true);
    setLoadingLangs(true);
    fraudService.getAdminScenarios()
      .then(list => {
        const found = list.find(s => s.id === Number(scenario.id));
        if (!found) return;
        setForm({
          title:            { uz: found.title.uz ?? "", ru: found.title.ru ?? "", en: found.title.en ?? "", cyrl: found.title.cyrl ?? "" },
          description:      { uz: found.description.uz ?? "", ru: found.description.ru ?? "", en: found.description.en ?? "", cyrl: found.description.cyrl ?? "" },
          learnerRole:      { uz: found.learnerRole.uz ?? "", ru: found.learnerRole.ru ?? "", en: found.learnerRole.en ?? "", cyrl: found.learnerRole.cyrl ?? "" },
          playUrl:          found.playUrl ?? null,
          estimatedMinutes: found.estimatedMinutes,
          passScore:        found.passScore,
        });
      })
      .finally(() => setLoadingLangs(false));
  }

  function setLang(field: "title" | "description" | "learnerRole", lang: keyof MultiLangValue, value: string) {
    setForm(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  }

  async function save() {
    setSaving(true);
    setSaveError(null);
    try {
      await fraudService.updateScenario(Number(scenario.id), form);
      onUpdated({
        ...scenario,
        title:            form.title.uz ?? scenario.title,
        description:      form.description.uz ?? scenario.description,
        learnerRole:      form.learnerRole.uz ?? scenario.learnerRole,
        estimatedMinutes: form.estimatedMinutes,
        passScore:        form.passScore,
        playUrl:          form.playUrl ?? undefined,
      });
      setEditing(false);
    } catch {
      setSaveError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-start gap-sm p-lg border-b border-hairline-soft shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-xs mb-sm">
            <Badge variant={typeBadge(scenario.fraudType)}>{TYPE_LABEL[scenario.fraudType]}</Badge>
            <Badge variant={diffBadge(scenario.difficulty)}>{DIFF_LABEL[scenario.difficulty]}</Badge>
            <Badge variant={riskBadge(scenario.riskLevel)}>Risk: {RISK_LABEL[scenario.riskLevel]}</Badge>
          </div>
          <h2 className="text-heading-4 text-ink font-display leading-snug">{scenario.title}</h2>
        </div>
        <div className="flex items-center gap-xs ml-sm shrink-0">
          {!editing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-xs px-sm py-xs rounded-lg border border-hairline-strong bg-canvas hover:bg-surface-soft text-body-sm text-ink transition-colors"
            >
              <Icon.Pencil />
              Edit
            </button>
          )}
          <button
            onClick={onClose}
            className="p-xs rounded-lg hover:bg-surface-soft text-slate hover:text-ink transition-colors"
          >
            <Icon.Close />
          </button>
        </div>
      </div>

      {editing ? (
        /* ── Edit form ── */
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-lg space-y-lg">
            {loadingLangs && (
              <p className="text-caption text-slate">Loading all language variants…</p>
            )}
            <MultiLangSection
              label="Title"
              value={form.title}
              onChange={(lang, val) => setLang("title", lang, val)}
            />
            <MultiLangSection
              label="Description"
              value={form.description}
              onChange={(lang, val) => setLang("description", lang, val)}
              multiline
            />
            <MultiLangSection
              label="Learner Role"
              value={form.learnerRole}
              onChange={(lang, val) => setLang("learnerRole", lang, val)}
              multiline
            />

            <div className="grid grid-cols-2 gap-sm">
              <div>
                <label className="text-caption-bold text-slate block mb-xs">Duration (min)</label>
                <Input
                  type="number"
                  value={form.estimatedMinutes}
                  onChange={e => setForm(p => ({ ...p, estimatedMinutes: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-caption-bold text-slate block mb-xs">Pass Score (%)</label>
                <Input
                  type="number"
                  value={form.passScore}
                  onChange={e => setForm(p => ({ ...p, passScore: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <label className="text-caption-bold text-slate block mb-xs">Play URL</label>
              <Input
                placeholder="https://… or /internal/path"
                value={form.playUrl ?? ""}
                onChange={e => setForm(p => ({ ...p, playUrl: e.target.value || null }))}
              />
            </div>

            {saveError && (
              <p className="text-caption text-error">{saveError}</p>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-sm p-lg border-t border-hairline-soft shrink-0">
            <Button variant="ghost" size="md" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <div className="flex-1 overflow-y-auto p-lg space-y-lg">
          <p className="text-body-md text-slate">{scenario.description}</p>

          <div className="grid grid-cols-2 gap-sm">
            <MetaItem icon={<Icon.Bolt />} label="Duration" value={`${scenario.estimatedMinutes} min`} />
            <MetaItem icon={<Icon.Chart />} label="Pass Score" value={`${scenario.passScore}%`} />
            <MetaItem icon={<Icon.Users />} label="Total Attempts" value={String(scenario.attempts)} />
            <MetaItem icon={<Icon.Trophy />} label="Avg Score" value={scenario.averageScore > 0 ? `${scenario.averageScore}%` : "—"} />
          </div>

          {scenario.skills.length > 0 && (
            <Section title="Skills">
              <div className="flex flex-wrap gap-xs">
                {scenario.skills.map(skill => (
                  <span key={skill} className="px-sm py-xs rounded-lg bg-surface-soft text-caption-bold text-slate">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <Section title="Context">
            <p className="text-body-sm text-ink leading-relaxed">{scenario.context}</p>
          </Section>

          <div className="grid grid-cols-1 gap-sm">
            <LabelValue label="Learner Role" value={scenario.learnerRole} />
            <LabelValue label="Task" value={scenario.task} />
            {scenario.playUrl && (
              <LabelValue label="Play URL" value={scenario.playUrl} />
            )}
          </div>

          <Section title={`Red Flags (${correctFlagsCount} correct / ${redFlags.length} total)`}>
            <ul className="space-y-xs">
              {redFlags.map(f => (
                <li key={f.id} className="flex items-start gap-sm">
                  <span className={cn("mt-[3px] shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px]", f.correct ? "bg-success-accent text-on-primary" : "bg-surface-soft text-slate")}>
                    {f.correct ? "✓" : "✗"}
                  </span>
                  <span className={cn("text-body-sm", f.correct ? "text-ink" : "text-slate")}>{f.label}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Decision Options">
            <ul className="space-y-xs">
              {decisions.map(d => (
                <li key={d.id} className="flex items-start gap-sm">
                  <span className={cn("mt-[3px] shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px]", d.correct ? "bg-success-accent text-on-primary" : "bg-surface-soft text-slate")}>
                    {d.correct ? "✓" : "✗"}
                  </span>
                  <span className={cn("text-body-sm font-medium", d.correct ? "text-ink" : "text-slate")}>{d.label}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Explanation">
            <p className="text-body-sm text-ink leading-relaxed">{scenario.explanation}</p>
          </Section>

          <Section title="Recommendation">
            <p className="text-body-sm text-ink leading-relaxed">{scenario.recommendation}</p>
          </Section>
        </div>
      )}
    </div>
  );
}

const LANG_LABELS: Record<keyof MultiLangValue, string> = {
  uz: "UZ (Latin)", ru: "RU", en: "EN", cyrl: "UZ (Cyrl)",
};

function MultiLangSection({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: MultiLangValue;
  onChange: (lang: keyof MultiLangValue, val: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-caption-bold text-slate uppercase tracking-wide mb-sm">{label}</p>
      <div className="grid grid-cols-1 gap-xs">
        {(Object.keys(LANG_LABELS) as Array<keyof MultiLangValue>).map(lang => (
          <div key={lang}>
            <label className="text-caption text-slate block mb-[2px]">{LANG_LABELS[lang]}</label>
            {multiline ? (
              <textarea
                className="w-full rounded-lg border border-hairline-strong bg-canvas px-md py-sm text-body-sm text-ink focus:outline-none focus:border-brand-blue focus:border-2 transition-colors resize-none"
                rows={3}
                value={value[lang] ?? ""}
                onChange={e => onChange(lang, e.target.value)}
              />
            ) : (
              <Input
                value={value[lang] ?? ""}
                onChange={e => onChange(lang, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-caption-bold text-slate uppercase tracking-wide mb-sm">{title}</h4>
      {children}
    </div>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-xs p-sm rounded-xl bg-surface-soft">
      <span className="text-slate w-4 h-4">{icon}</span>
      <div className="min-w-0">
        <p className="text-caption text-slate">{label}</p>
        <p className="text-caption-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function LabelValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-sm rounded-xl bg-surface-soft">
      <p className="text-caption-bold text-slate mb-[2px]">{label}</p>
      <p className="text-body-sm text-ink leading-relaxed">{value}</p>
    </div>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center px-lg py-sm bg-surface-soft rounded-2xl">
      <span className="text-heading-4 text-ink font-display">{value}</span>
      <span className="text-caption text-slate">{label}</span>
    </div>
  );
}

// ── Scenario row ──────────────────────────────────────────────────────────────

type RowProps = {
  scenario: FraudSimScenario;
  onClick: () => void;
};

function ScenarioRow({ scenario, onClick }: RowProps) {
  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="w-full text-left p-md hover:shadow-elev-2 transition-shadow group cursor-pointer"
    >
      <div className="flex items-start gap-md">
        {/* badges + title */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-xs mb-xs">
            <Badge variant={typeBadge(scenario.fraudType)} className="text-[11px]">
              {TYPE_LABEL[scenario.fraudType]}
            </Badge>
            <Badge variant={diffBadge(scenario.difficulty)} className="text-[11px]">
              {DIFF_LABEL[scenario.difficulty]}
            </Badge>
            <Badge variant={riskBadge(scenario.riskLevel)} className="text-[11px]">
              {RISK_LABEL[scenario.riskLevel]}
            </Badge>
          </div>
          <h3 className="text-body-md font-semibold text-ink group-hover:text-primary transition-colors leading-snug">
            {scenario.title}
          </h3>
          <p className="mt-[2px] text-caption text-slate line-clamp-2">{scenario.description}</p>
        </div>

        {/* stats */}
        <div className="shrink-0 hidden sm:flex items-center gap-md text-right">
          <div>
            <p className="text-caption text-slate">Duration</p>
            <p className="text-caption-bold text-ink">{scenario.estimatedMinutes} min</p>
          </div>
          <div>
            <p className="text-caption text-slate">Pass score</p>
            <p className="text-caption-bold text-ink">{scenario.passScore}%</p>
          </div>
          <div>
            <p className="text-caption text-slate">Attempts</p>
            <p className="text-caption-bold text-ink">{scenario.attempts}</p>
          </div>
          <div className="w-5 text-slate group-hover:text-primary transition-colors">
            <Icon.Chevron />
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AdminFraudScenarios() {
  const { locale } = useLocale();
  const [scenarios, setScenarios]   = useState<FraudSimScenario[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [selected, setSelected]     = useState<FraudSimScenario | null>(null);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState<FraudSimType | "">("");
  const [diffFilter, setDiffFilter] = useState<FraudSimDifficulty | "">("");
  const [riskFilter, setRiskFilter] = useState<FraudSimRisk | "">("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fraudService.getScenarios(locale)
      .then(setScenarios)
      .catch(() => setError("Failed to load scenarios. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, [locale]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return scenarios.filter(s => {
      if (q && !s.title.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
      if (typeFilter && s.fraudType !== typeFilter) return false;
      if (diffFilter && s.difficulty !== diffFilter) return false;
      if (riskFilter && s.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [scenarios, search, typeFilter, diffFilter, riskFilter]);

  const typeGroups = useMemo(() => {
    const g: Record<string, number> = {};
    for (const s of scenarios) g[s.fraudType] = (g[s.fraudType] ?? 0) + 1;
    return g;
  }, [scenarios]);

  const totalAttempts = scenarios.reduce((sum, s) => sum + s.attempts, 0);
  const activeTypes   = Object.keys(typeGroups).length;

  return (
    <div className="min-h-full bg-canvas">
      <div className="max-w-5xl mx-auto px-lg py-xl space-y-xl">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-md justify-between">
          <div>
            <p className="text-caption-bold text-slate uppercase tracking-wide mb-xs">Fraud Scenarios</p>
            <h1 className="text-heading-2 text-ink font-display">Anti-Fraud Simulator</h1>
            <p className="mt-xs text-body-md text-slate">
              Manage fraud training scenarios across all pillars. Click any row to see full content and correct answers.
            </p>
          </div>

          {!loading && !error && (
            <div className="flex gap-sm shrink-0">
              <StatChip label="Scenarios" value={scenarios.length} />
              <StatChip label="Pillars" value={activeTypes} />
              <StatChip label="Attempts" value={totalAttempts} />
            </div>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-sm">
          <Input
            placeholder="Search scenarios…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] max-w-sm"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as FraudSimType | "")}
            className="h-[44px] appearance-none rounded-md border border-hairline-strong bg-canvas pl-md pr-2xl py-sm text-body-md text-ink focus:outline-none focus:border-brand-blue focus:border-2 transition-colors"
          >
            {TYPE_OPTS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={diffFilter}
            onChange={e => setDiffFilter(e.target.value as FraudSimDifficulty | "")}
            className="h-[44px] appearance-none rounded-md border border-hairline-strong bg-canvas pl-md pr-2xl py-sm text-body-md text-ink focus:outline-none focus:border-brand-blue focus:border-2 transition-colors"
          >
            {DIFF_OPTS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value as FraudSimRisk | "")}
            className="h-[44px] appearance-none rounded-md border border-hairline-strong bg-canvas pl-md pr-2xl py-sm text-body-md text-ink focus:outline-none focus:border-brand-blue focus:border-2 transition-colors"
          >
            {RISK_OPTS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {(search || typeFilter || diffFilter || riskFilter) && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => { setSearch(""); setTypeFilter(""); setDiffFilter(""); setRiskFilter(""); }}
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* ── Content ── */}
        {loading && (
          <div className="flex items-center justify-center py-section">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <EmptyState
            tone="soft"
            title="Could not load scenarios"
            description={error}
            icon={<Icon.Shield />}
          />
        )}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            tone="soft"
            title="No scenarios match"
            description="Try adjusting the filters or search query."
            icon={<Icon.Shield />}
            action={
              <Button
                variant="ghost"
                size="md"
                onClick={() => { setSearch(""); setTypeFilter(""); setDiffFilter(""); setRiskFilter(""); }}
              >
                Clear filters
              </Button>
            }
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-sm">
            {filtered.map(s => (
              <ScenarioRow key={s.id} scenario={s} onClick={() => setSelected(s)} />
            ))}
            <p className="text-caption text-slate text-center pt-sm">
              {filtered.length} of {scenarios.length} scenarios
            </p>
          </div>
        )}
      </div>

      {/* ── Drawer ── */}
      <ScenarioDrawer
        scenario={selected}
        onClose={() => setSelected(null)}
        onUpdated={updated => {
          setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s));
          setSelected(updated);
        }}
      />
    </div>
  );
}
