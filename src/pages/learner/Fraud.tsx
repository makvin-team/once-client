// Learner Fraud Simulator page.
//
// State for the filter/list/play flow lives here; sub-views below are pure
// presentation. Strings come from t.app.fraud (see i18n) so the page reads
// correctly in en/uz/uz-Cyrl/ru. Scenario *content* (titles, evidence text,
// red-flag labels) stays in src/data/fraudSim.ts — those are domain copy
// rather than UI chrome.

import { useMemo, useState, type ReactNode } from "react";
import { PageHeader } from "../../components/app/PageHeader";
import { StatCard } from "../../components/app/StatCard";
import { StatusPill } from "../../components/app/StatusPill";
import { EmptyState } from "../../components/app/EmptyState";
import { Icon } from "../../components/app/icons";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useT } from "../../i18n";
import { cn } from "../../lib/cn";
import {
  type DecisionOption,
  type FraudAttemptRecord,
  type FraudEvidence,
  type FraudSimDifficulty,
  type FraudSimRisk,
  type FraudSimScenario,
  type FraudSimStatus,
  type FraudSimType,
  type RedFlagOption,
  mockFraudScenarios,
  mockLearnerAttempts,
  mockLearnerStats,
} from "../../data/fraudSim";
import type { LandingContent } from "../../i18n/types";

type FraudCopy = LandingContent["app"]["fraud"];

// ----------------------------- Filter types ------------------------------

type Tab = "all" | "attempts" | "favorites";
type SortKey =
  | "updated"
  | "highestRisk"
  | "easiest"
  | "mostAttempts"
  | "bestScore";

// Keep the canonical option orderings here so dropdowns + reverse-lookups stay
// in sync. Filter state is the enum key (or null) — the Select renders the
// matching translated label. Switching locale relabels options without
// breaking the active filter.
const TYPE_KEYS: ReadonlyArray<FraudSimType> = [
  "phishing",
  "transaction",
  "document",
  "deepfake_call",
  "social_engineering",
  "aml_kyc",
];
const DIFFICULTY_KEYS: ReadonlyArray<FraudSimDifficulty> = [
  "beginner",
  "intermediate",
  "advanced",
];
const RISK_KEYS: ReadonlyArray<FraudSimRisk> = ["low", "medium", "high"];
const SORT_KEYS: ReadonlyArray<SortKey> = [
  "updated",
  "highestRisk",
  "easiest",
  "mostAttempts",
  "bestScore",
];

const RISK_RANK: Record<FraudSimRisk, number> = { low: 0, medium: 1, high: 2 };
const DIFFICULTY_RANK: Record<FraudSimDifficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

function statusToneFor(status: FraudSimStatus) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "in_progress":
      return "info" as const;
    case "failed":
      return "warning" as const;
    default:
      return "muted" as const;
  }
}

function typeLabel(t: FraudCopy, k: FraudSimType) {
  return t.filters.types[k];
}
function difficultyLabel(t: FraudCopy, k: FraudSimDifficulty) {
  return t.filters.difficulty[k];
}
function riskLabel(t: FraudCopy, k: FraudSimRisk) {
  return t.filters.risk[k];
}
function statusLabel(t: FraudCopy, k: FraudSimStatus) {
  return t.status[k];
}
function sortLabel(t: FraudCopy, k: SortKey) {
  return t.filters.sort[k];
}

// --------------------- Play-mode state types ----------------------------

type PlayPhase = "intro" | "evidence" | "redflags" | "decision" | "result";

type PlayState = {
  scenarioId: string;
  phase: PlayPhase;
  selectedFlagIds: ReadonlyArray<string>;
  selectedDecisionId: string | null;
  validationError: string | null;
  result: PlayResult | null;
};

type PlayResult = {
  score: number;
  passed: boolean;
  detectedFlagIds: ReadonlyArray<string>;
  missedFlagIds: ReadonlyArray<string>;
  wrongFlagIds: ReadonlyArray<string>;
  correctDecisionId: string;
  learnerDecisionId: string;
};

// Scoring: +15 per correct flag, -5 per wrong flag, +25 for correct decision;
// clamp to [0, 100], pass at scenario.passScore (default 70).
function scorePlay(
  scenario: FraudSimScenario,
  selectedFlagIds: ReadonlyArray<string>,
  decisionId: string,
): PlayResult {
  const detectedFlagIds: string[] = [];
  const wrongFlagIds: string[] = [];
  let score = 0;

  for (const flag of scenario.redFlagOptions) {
    const picked = selectedFlagIds.includes(flag.id);
    if (picked && flag.correct) {
      detectedFlagIds.push(flag.id);
      score += 15;
    } else if (picked && !flag.correct) {
      wrongFlagIds.push(flag.id);
      score -= 5;
    }
  }

  const correctDecision = scenario.decisionOptions.find((d) => d.correct);
  const correctDecisionId = correctDecision ? correctDecision.id : "";
  if (decisionId === correctDecisionId) score += 25;

  const missedFlagIds = scenario.redFlagOptions
    .filter((f) => f.correct && !selectedFlagIds.includes(f.id))
    .map((f) => f.id);

  const clamped = Math.max(0, Math.min(100, score));

  return {
    score: clamped,
    passed: clamped >= scenario.passScore,
    detectedFlagIds,
    missedFlagIds,
    wrongFlagIds,
    correctDecisionId,
    learnerDecisionId: decisionId,
  };
}

// ------------------------------ Page ------------------------------------

export function LearnerFraud() {
  const i18n = useT();
  const t = i18n.app.fraud;

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  // Filter state holds enum keys (or null for "all"), so changing locale
  // doesn't drop the active filter.
  const [typeFilter, setTypeFilter] = useState<FraudSimType | null>(null);
  const [difficultyFilter, setDifficultyFilter] =
    useState<FraudSimDifficulty | null>(null);
  const [riskFilter, setRiskFilter] = useState<FraudSimRisk | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("updated");

  const [statuses, setStatuses] = useState<Record<string, FraudSimStatus>>(
    () => {
      const m: Record<string, FraudSimStatus> = {};
      for (const s of mockFraudScenarios) m[s.id] = s.initialStatus;
      return m;
    },
  );
  const [bestScores, setBestScores] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const s of mockFraudScenarios) {
      if (s.previousBest != null) m[s.id] = s.previousBest;
    }
    return m;
  });

  const [favorites, setFavorites] = useState<ReadonlyArray<string>>([]);
  const [attempts, setAttempts] = useState<ReadonlyArray<FraudAttemptRecord>>(
    mockLearnerAttempts,
  );

  const [detailScenarioId, setDetailScenarioId] = useState<string | null>(null);
  const [play, setPlay] = useState<PlayState | null>(null);
  const [attemptDetail, setAttemptDetail] = useState<FraudAttemptRecord | null>(
    null,
  );

  // ------------------ Derived: filtered + sorted scenarios ---------------

  const filteredScenarios = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = mockFraudScenarios.filter((s) => {
      if (typeFilter && s.fraudType !== typeFilter) return false;
      if (difficultyFilter && s.difficulty !== difficultyFilter) return false;
      if (riskFilter && s.riskLevel !== riskFilter) return false;
      if (q) {
        const hay = `${s.title} ${s.description} ${typeLabel(t, s.fraudType)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "highestRisk":
          return RISK_RANK[b.riskLevel] - RISK_RANK[a.riskLevel];
        case "easiest":
          return DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
        case "mostAttempts":
          return b.attempts - a.attempts;
        case "bestScore":
          return (bestScores[b.id] ?? 0) - (bestScores[a.id] ?? 0);
        case "updated":
        default:
          return a.updatedAt < b.updatedAt ? 1 : -1;
      }
    });

    return list;
  }, [search, typeFilter, difficultyFilter, riskFilter, sortKey, bestScores, t]);

  const favoriteScenarios = useMemo(
    () => mockFraudScenarios.filter((s) => favorites.includes(s.id)),
    [favorites],
  );

  // ----------------------------- Handlers --------------------------------

  function clearFilters() {
    setSearch("");
    setTypeFilter(null);
    setDifficultyFilter(null);
    setRiskFilter(null);
    setSortKey("updated");
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function openDetail(id: string) {
    setDetailScenarioId(id);
  }

  function startScenario(id: string) {
    setDetailScenarioId(null);
    setAttemptDetail(null);
    setStatuses((prev) =>
      prev[id] === "completed" ? prev : { ...prev, [id]: "in_progress" },
    );
    setPlay({
      scenarioId: id,
      phase: "intro",
      selectedFlagIds: [],
      selectedDecisionId: null,
      validationError: null,
      result: null,
    });
  }

  function recommendedScenarioId(): string {
    const notStarted = mockFraudScenarios.filter(
      (s) => (statuses[s.id] ?? s.initialStatus) === "not_started",
    );
    const beginnerOrIntermediate = notStarted.filter(
      (s) => s.difficulty !== "advanced",
    );
    const high = beginnerOrIntermediate.find((s) => s.riskLevel === "high");
    if (high) return high.id;
    if (beginnerOrIntermediate[0]) return beginnerOrIntermediate[0].id;
    if (notStarted[0]) return notStarted[0].id;
    return mockFraudScenarios[0].id;
  }

  function handlePlayBack() {
    setPlay(null);
  }

  function submitPlay() {
    if (!play) return;
    const scenario = mockFraudScenarios.find((s) => s.id === play.scenarioId);
    if (!scenario) return;
    if (!play.selectedDecisionId) {
      setPlay({ ...play, validationError: t.play.decision.validation });
      return;
    }
    const result = scorePlay(
      scenario,
      play.selectedFlagIds,
      play.selectedDecisionId,
    );
    setPlay({ ...play, phase: "result", result, validationError: null });

    setStatuses((prev) => ({
      ...prev,
      [scenario.id]: result.passed ? "completed" : "failed",
    }));
    setBestScores((prev) => ({
      ...prev,
      [scenario.id]: Math.max(prev[scenario.id] ?? 0, result.score),
    }));
    setAttempts((prev) => [
      {
        id: `att_${Date.now()}`,
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        fraudType: scenario.fraudType,
        score: result.score,
        passed: result.passed,
        detectedFlags: result.detectedFlagIds.length,
        missedFlags: result.missedFlagIds.length,
        attemptedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  }

  // ------------------------------- Render --------------------------------

  const detailScenario = detailScenarioId
    ? mockFraudScenarios.find((s) => s.id === detailScenarioId) ?? null
    : null;
  const playScenario = play
    ? mockFraudScenarios.find((s) => s.id === play.scenarioId) ?? null
    : null;

  return (
    <div className="flex flex-col gap-section-sm">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.subtitle}
        actions={
          <Button
            variant="primary"
            size="lg"
            onClick={() => startScenario(recommendedScenarioId())}
          >
            {t.primaryCta}
          </Button>
        }
      />

      <div className="grid gap-xl lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 flex flex-col gap-lg">
          <TabsBar
            t={t}
            tab={tab}
            onChange={setTab}
            attemptsCount={attempts.length}
            favoritesCount={favorites.length}
          />

          {tab === "all" && (
            <>
              <FiltersRow
                t={t}
                search={search}
                onSearch={setSearch}
                typeFilter={typeFilter}
                onType={setTypeFilter}
                difficultyFilter={difficultyFilter}
                onDifficulty={setDifficultyFilter}
                riskFilter={riskFilter}
                onRisk={setRiskFilter}
                sortKey={sortKey}
                onSort={setSortKey}
              />
              {filteredScenarios.length === 0 ? (
                <EmptyState
                  title={t.empty.noResults.title}
                  description={t.empty.noResults.body}
                  action={
                    <Button variant="secondary" onClick={clearFilters}>
                      {t.empty.noResults.action}
                    </Button>
                  }
                />
              ) : (
                <ScenarioList
                  t={t}
                  scenarios={filteredScenarios}
                  statuses={statuses}
                  bestScores={bestScores}
                  favorites={favorites}
                  onOpenDetail={openDetail}
                  onStart={startScenario}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </>
          )}

          {tab === "attempts" && (
            <AttemptsTab
              t={t}
              attempts={attempts}
              onViewResult={(att) => setAttemptDetail(att)}
              onRetry={(id) => startScenario(id)}
              onGotoAll={() => setTab("all")}
            />
          )}

          {tab === "favorites" && (
            <>
              {favoriteScenarios.length === 0 ? (
                <EmptyState
                  title={t.empty.noFavorites.title}
                  description={t.empty.noFavorites.body}
                  action={
                    <Button variant="primary" onClick={() => setTab("all")}>
                      {t.empty.noFavorites.action}
                    </Button>
                  }
                />
              ) : (
                <ScenarioList
                  t={t}
                  scenarios={favoriteScenarios}
                  statuses={statuses}
                  bestScores={bestScores}
                  favorites={favorites}
                  onOpenDetail={openDetail}
                  onStart={startScenario}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </>
          )}
        </div>

        <aside className="flex flex-col gap-lg">
          <StatsCard t={t} />
          <TipCard t={t} />
        </aside>
      </div>

      {detailScenario && (
        <ScenarioDetailModal
          t={t}
          scenario={detailScenario}
          status={statuses[detailScenario.id] ?? detailScenario.initialStatus}
          bestScore={bestScores[detailScenario.id]}
          isFavorite={favorites.includes(detailScenario.id)}
          onClose={() => setDetailScenarioId(null)}
          onStart={() => startScenario(detailScenario.id)}
          onToggleFavorite={() => toggleFavorite(detailScenario.id)}
        />
      )}

      {play && playScenario && (
        <PlayOverlay
          t={t}
          scenario={playScenario}
          state={play}
          onChange={setPlay}
          onSubmit={submitPlay}
          onBack={handlePlayBack}
          onRetry={() => startScenario(playScenario.id)}
          onNext={() => {
            const next = nextScenarioAfter(playScenario.id);
            if (next) startScenario(next);
            else handlePlayBack();
          }}
        />
      )}

      {attemptDetail && (
        <AttemptDetailModal
          t={t}
          attempt={attemptDetail}
          onClose={() => setAttemptDetail(null)}
          onRetry={() => {
            const id = attemptDetail.scenarioId;
            setAttemptDetail(null);
            startScenario(id);
          }}
        />
      )}
    </div>
  );
}

function nextScenarioAfter(id: string): string | null {
  const i = mockFraudScenarios.findIndex((s) => s.id === id);
  if (i < 0) return null;
  return mockFraudScenarios[(i + 1) % mockFraudScenarios.length].id;
}

// ----------------------------- Sub-views --------------------------------

function TabsBar({
  t,
  tab,
  onChange,
  attemptsCount,
  favoritesCount,
}: {
  t: FraudCopy;
  tab: Tab;
  onChange: (t: Tab) => void;
  attemptsCount: number;
  favoritesCount: number;
}) {
  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: "all", label: t.tabs.all },
    { id: "attempts", label: t.tabs.attempts, count: attemptsCount },
    { id: "favorites", label: t.tabs.favorites, count: favoritesCount },
  ];
  return (
    <div
      role="tablist"
      className="inline-flex items-center gap-xxs rounded-full bg-surface p-[4px] self-start"
    >
      {tabs.map((tab1) => {
        const active = tab === tab1.id;
        return (
          <button
            key={tab1.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab1.id)}
            className={cn(
              "px-md py-xs rounded-full text-button-md transition-colors",
              active
                ? "bg-canvas text-ink shadow-elev-1"
                : "text-steel hover:text-ink",
            )}
          >
            {tab1.label}
            {tab1.count != null && tab1.count > 0 && (
              <span
                className={cn(
                  "ml-xs inline-flex items-center justify-center min-w-[18px] h-[18px] px-[6px] rounded-full text-caption-bold",
                  active ? "bg-surface text-ink" : "bg-canvas text-steel",
                )}
              >
                {tab1.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Helper hook: given an enum keys list, build a parallel labels list with the
// "All" sentinel at position 0, and resolve the currently-selected key to its
// option string so the native <select> reflects state correctly.
function useEnumSelect<K extends string>(
  t: FraudCopy,
  keys: ReadonlyArray<K>,
  labelFor: (k: K) => string,
  current: K | null,
) {
  const labels = useMemo(
    () => [t.filters.all, ...keys.map(labelFor)],
    [t, keys, labelFor],
  );
  const value = current ? labelFor(current) : t.filters.all;
  return { labels, value };
}

function FiltersRow({
  t,
  search,
  onSearch,
  typeFilter,
  onType,
  difficultyFilter,
  onDifficulty,
  riskFilter,
  onRisk,
  sortKey,
  onSort,
}: {
  t: FraudCopy;
  search: string;
  onSearch: (v: string) => void;
  typeFilter: FraudSimType | null;
  onType: (v: FraudSimType | null) => void;
  difficultyFilter: FraudSimDifficulty | null;
  onDifficulty: (v: FraudSimDifficulty | null) => void;
  riskFilter: FraudSimRisk | null;
  onRisk: (v: FraudSimRisk | null) => void;
  sortKey: SortKey;
  onSort: (v: SortKey) => void;
}) {
  const typeSel = useEnumSelect(
    t,
    TYPE_KEYS,
    (k) => typeLabel(t, k),
    typeFilter,
  );
  const diffSel = useEnumSelect(
    t,
    DIFFICULTY_KEYS,
    (k) => difficultyLabel(t, k),
    difficultyFilter,
  );
  const riskSel = useEnumSelect(
    t,
    RISK_KEYS,
    (k) => riskLabel(t, k),
    riskFilter,
  );
  const sortLabels = SORT_KEYS.map((k) => sortLabel(t, k));

  return (
    <div className="grid gap-sm md:grid-cols-2 lg:grid-cols-5">
      <Input
        placeholder={t.filters.searchPlaceholder}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="md:col-span-2 lg:col-span-2"
      />
      <Select
        options={typeSel.labels}
        value={typeSel.value}
        onChange={(e) => {
          const idx = typeSel.labels.indexOf(e.target.value);
          onType(idx <= 0 ? null : TYPE_KEYS[idx - 1]);
        }}
      />
      <Select
        options={diffSel.labels}
        value={diffSel.value}
        onChange={(e) => {
          const idx = diffSel.labels.indexOf(e.target.value);
          onDifficulty(idx <= 0 ? null : DIFFICULTY_KEYS[idx - 1]);
        }}
      />
      <Select
        options={riskSel.labels}
        value={riskSel.value}
        onChange={(e) => {
          const idx = riskSel.labels.indexOf(e.target.value);
          onRisk(idx <= 0 ? null : RISK_KEYS[idx - 1]);
        }}
      />
      <Select
        options={sortLabels}
        value={sortLabel(t, sortKey)}
        onChange={(e) => {
          const idx = sortLabels.indexOf(e.target.value);
          onSort(SORT_KEYS[Math.max(0, idx)] ?? "updated");
        }}
        className="lg:col-span-5"
      />
    </div>
  );
}

function ScenarioList({
  t,
  scenarios,
  statuses,
  bestScores,
  favorites,
  onOpenDetail,
  onStart,
  onToggleFavorite,
}: {
  t: FraudCopy;
  scenarios: ReadonlyArray<FraudSimScenario>;
  statuses: Record<string, FraudSimStatus>;
  bestScores: Record<string, number>;
  favorites: ReadonlyArray<string>;
  onOpenDetail: (id: string) => void;
  onStart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-hairline-soft bg-canvas overflow-hidden">
      <div className="hidden lg:grid grid-cols-[2fr_120px_120px_120px_100px_90px_110px_140px] gap-md px-lg py-sm bg-surface-soft text-caption-bold text-steel uppercase tracking-wide">
        <div>{t.list.scenario}</div>
        <div>{t.list.type}</div>
        <div>{t.list.difficulty}</div>
        <div>{t.list.risk}</div>
        <div>{t.list.avgScore}</div>
        <div>{t.list.attempts}</div>
        <div>{t.list.updated}</div>
        <div className="text-right">{t.list.actions}</div>
      </div>

      <ul className="divide-y divide-hairline-soft">
        {scenarios.map((s) => {
          const status = statuses[s.id] ?? s.initialStatus;
          const isFav = favorites.includes(s.id);
          const best = bestScores[s.id];
          return (
            <li key={s.id} className="px-lg py-md">
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_120px_120px_120px_100px_90px_110px_140px] lg:items-center gap-sm lg:gap-md">
                <div className="min-w-0 flex items-start gap-sm">
                  <FraudTypeIcon type={s.fraudType} />
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(s.id)}
                      className="block text-left text-body-md-medium text-ink hover:text-brand-blue truncate"
                    >
                      {s.title}
                    </button>
                    <p className="text-caption text-steel line-clamp-2">
                      {s.description}
                    </p>
                    <div className="mt-xs flex items-center gap-xs flex-wrap lg:hidden">
                      <Badge variant="tag-purple">
                        {typeLabel(t, s.fraudType)}
                      </Badge>
                      <Badge variant={difficultyBadge(s.difficulty)}>
                        {difficultyLabel(t, s.difficulty)}
                      </Badge>
                      <Badge variant={riskBadge(s.riskLevel)}>
                        {riskLabel(t, s.riskLevel)}
                      </Badge>
                      <StatusPill
                        label={statusLabel(t, status)}
                        tone={statusToneFor(status)}
                      />
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Badge variant="tag-purple">{typeLabel(t, s.fraudType)}</Badge>
                </div>
                <div className="hidden lg:block">
                  <Badge variant={difficultyBadge(s.difficulty)}>
                    {difficultyLabel(t, s.difficulty)}
                  </Badge>
                </div>
                <div className="hidden lg:block">
                  <Badge variant={riskBadge(s.riskLevel)}>
                    {riskLabel(t, s.riskLevel)}
                  </Badge>
                </div>
                <div className="hidden lg:block text-body-sm text-ink">
                  {best != null ? `${best}%` : `${s.averageScore}%`}
                </div>
                <div className="hidden lg:block text-body-sm text-steel">
                  {s.attempts}
                </div>
                <div className="hidden lg:block text-caption text-steel">
                  {s.updatedAt}
                </div>
                <div className="flex items-center gap-xs lg:justify-end">
                  <StatusPill
                    label={statusLabel(t, status)}
                    tone={statusToneFor(status)}
                    className="lg:hidden"
                  />
                  <FavoriteButton
                    t={t}
                    active={isFav}
                    onClick={() => onToggleFavorite(s.id)}
                  />
                  <Button
                    size="md"
                    variant={status === "in_progress" ? "blue" : "primary"}
                    onClick={() => onStart(s.id)}
                  >
                    {primaryActionLabel(t, status)}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function primaryActionLabel(t: FraudCopy, status: FraudSimStatus): string {
  switch (status) {
    case "in_progress":
      return t.actions.continue;
    case "completed":
    case "failed":
      return t.actions.retry;
    default:
      return t.actions.start;
  }
}

function difficultyBadge(
  d: FraudSimDifficulty,
): "tag-yellow" | "tag-coral" | "tag-purple" {
  switch (d) {
    case "beginner":
      return "tag-yellow";
    case "intermediate":
      return "tag-purple";
    case "advanced":
      return "tag-coral";
  }
}

function riskBadge(r: FraudSimRisk): "tag-yellow" | "tag-coral" | "tag-teal" {
  switch (r) {
    case "low":
      return "tag-teal";
    case "medium":
      return "tag-yellow";
    case "high":
      return "tag-coral";
  }
}

function FavoriteButton({
  t,
  active,
  onClick,
}: {
  t: FraudCopy;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={active ? t.actions.removeFavorite : t.actions.addFavorite}
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors",
        active
          ? "bg-surface-yellow text-yellow-dark"
          : "bg-surface text-steel hover:text-ink",
      )}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 2.5l1.8 3.7 4.1.6-3 2.9.7 4-3.6-1.9-3.6 1.9.7-4-3-2.9 4.1-.6L8 2.5Z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function FraudTypeIcon({ type }: { type: FraudSimType }) {
  const map: Record<FraudSimType, { bg: string; icon: ReactNode }> = {
    phishing: {
      bg: "bg-coral-light text-coral-dark",
      icon: <Icon.Chat />,
    },
    transaction: {
      bg: "bg-surface-yellow text-yellow-dark",
      icon: <Icon.Chart />,
    },
    document: {
      bg: "bg-surface-pricing-featured text-brand-blue",
      icon: <Icon.Doc />,
    },
    deepfake_call: {
      bg: "bg-rose-light text-coral-dark",
      icon: <Icon.Bell />,
    },
    social_engineering: {
      bg: "bg-teal-light text-moss-dark",
      icon: <Icon.Users />,
    },
    aml_kyc: {
      bg: "bg-surface text-ink",
      icon: <Icon.Shield />,
    },
  };
  const v = map[type];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-md pastel shrink-0",
        v.bg,
      )}
    >
      {v.icon}
    </span>
  );
}

// ------------------------------ Sidebar ---------------------------------

function StatsCard({ t }: { t: FraudCopy }) {
  return (
    <Card size="base" className="!p-lg">
      <h3 className="text-heading-5 text-ink mb-md">{t.sidebar.statsTitle}</h3>
      <div className="grid grid-cols-2 gap-sm">
        <StatCard
          label={t.sidebar.totalAttempts}
          value={mockLearnerStats.totalAttempts}
        />
        <StatCard
          label={t.sidebar.averageScore}
          value={`${mockLearnerStats.averageScore}%`}
          delta={{ value: "+4%", tone: "positive" }}
        />
        <StatCard
          label={t.sidebar.bestScore}
          value={`${mockLearnerStats.bestScore}%`}
        />
        <StatCard
          label={t.sidebar.passedFailed}
          value={`${mockLearnerStats.passedCount} / ${mockLearnerStats.failedCount}`}
        />
      </div>
    </Card>
  );
}

function TipCard({ t }: { t: FraudCopy }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card tone="yellow" size="base">
      <p className="text-micro-uppercase uppercase text-yellow-dark mb-xs">
        {t.sidebar.tipTitle}
      </p>
      <p className="text-body-md text-primary">{t.sidebar.tipBody}</p>
      {expanded && (
        <ul className="mt-md list-disc pl-md space-y-xs text-body-sm text-primary">
          {t.sidebar.tipExpanded.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <div className="mt-md flex items-center justify-between">
        <span className="text-caption-bold text-primary">
          {t.sidebar.tipProgress}
        </span>
        <Button variant="link" onClick={() => setExpanded((v) => !v)}>
          {expanded ? t.actions.close : t.sidebar.tipMore}
        </Button>
      </div>
    </Card>
  );
}

// --------------------------- Attempts tab -------------------------------

function AttemptsTab({
  t,
  attempts,
  onViewResult,
  onRetry,
  onGotoAll,
}: {
  t: FraudCopy;
  attempts: ReadonlyArray<FraudAttemptRecord>;
  onViewResult: (a: FraudAttemptRecord) => void;
  onRetry: (scenarioId: string) => void;
  onGotoAll: () => void;
}) {
  if (attempts.length === 0) {
    return (
      <EmptyState
        title={t.empty.noAttempts.title}
        description={t.empty.noAttempts.body}
        action={
          <Button variant="primary" onClick={onGotoAll}>
            {t.empty.noAttempts.action}
          </Button>
        }
      />
    );
  }
  return (
    <div className="rounded-2xl border border-hairline-soft bg-canvas overflow-hidden">
      <div className="hidden lg:grid grid-cols-[2fr_140px_90px_110px_120px_120px_220px] gap-md px-lg py-sm bg-surface-soft text-caption-bold text-steel uppercase tracking-wide">
        <div>{t.attempts.scenario}</div>
        <div>{t.attempts.type}</div>
        <div>{t.attempts.score}</div>
        <div>{t.attempts.result}</div>
        <div>{t.attempts.detected}</div>
        <div>{t.attempts.missed}</div>
        <div className="text-right">{t.attempts.action}</div>
      </div>
      <ul className="divide-y divide-hairline-soft">
        {attempts.map((a) => (
          <li key={a.id} className="px-lg py-md">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_140px_90px_110px_120px_120px_220px] lg:items-center gap-sm lg:gap-md">
              <div className="min-w-0">
                <p className="text-body-md-medium text-ink truncate">
                  {a.scenarioTitle}
                </p>
                <p className="text-caption text-steel">{a.attemptedAt}</p>
              </div>
              <Badge variant="tag-purple">{typeLabel(t, a.fraudType)}</Badge>
              <div className="text-body-md text-ink">{a.score}%</div>
              <StatusPill
                label={a.passed ? t.play.result.passedBadge : t.play.result.failedBadge}
                tone={a.passed ? "success" : "danger"}
              />
              <div className="text-body-sm text-ink">{a.detectedFlags}</div>
              <div className="text-body-sm text-coral-dark">{a.missedFlags}</div>
              <div className="flex items-center gap-xs lg:justify-end">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => onViewResult(a)}
                >
                  {t.attempts.viewResult}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onRetry(a.scenarioId)}
                >
                  {t.attempts.retry}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --------------------------- Detail modal --------------------------------

function ScenarioDetailModal({
  t,
  scenario,
  status,
  bestScore,
  isFavorite,
  onClose,
  onStart,
  onToggleFavorite,
}: {
  t: FraudCopy;
  scenario: FraudSimScenario;
  status: FraudSimStatus;
  bestScore?: number;
  isFavorite: boolean;
  onClose: () => void;
  onStart: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <ModalShell title={scenario.title} onClose={onClose} closeLabel={t.actions.close}>
      <div className="flex flex-col gap-md">
        <div className="flex flex-wrap items-center gap-xs">
          <Badge variant="tag-purple">{typeLabel(t, scenario.fraudType)}</Badge>
          <Badge variant={difficultyBadge(scenario.difficulty)}>
            {difficultyLabel(t, scenario.difficulty)}
          </Badge>
          <Badge variant={riskBadge(scenario.riskLevel)}>
            {t.list.risk}: {riskLabel(t, scenario.riskLevel)}
          </Badge>
          <StatusPill
            label={statusLabel(t, status)}
            tone={statusToneFor(status)}
          />
        </div>

        <p className="text-body-md text-charcoal">{scenario.description}</p>

        <div className="grid grid-cols-2 gap-sm md:grid-cols-4">
          <Meta
            label={t.detail.durationLabel}
            value={`${scenario.estimatedMinutes} ${t.detail.durationMinutes}`}
          />
          <Meta
            label={t.detail.passScoreLabel}
            value={`${scenario.passScore}%`}
          />
          <Meta
            label={t.detail.redFlagCountLabel}
            value={String(scenario.redFlagOptions.length)}
          />
          <Meta
            label={t.detail.previousBestLabel}
            value={bestScore != null ? `${bestScore}%` : t.play.result.dash}
          />
        </div>

        <div>
          <p className="text-caption-bold text-steel uppercase tracking-wide mb-xs">
            {t.detail.skillsLabel}
          </p>
          <ul className="flex flex-wrap gap-xs">
            {scenario.skills.map((s) => (
              <li
                key={s}
                className="rounded-full bg-surface text-steel px-md py-[6px] text-caption-bold"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-surface-soft p-md">
          <p className="text-caption-bold text-steel uppercase tracking-wide mb-xxs">
            {t.detail.roleLabel}
          </p>
          <p className="text-body-md text-ink">{scenario.learnerRole}</p>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center gap-sm md:justify-between mt-xs">
          <Button variant="ghost" onClick={onToggleFavorite}>
            {isFavorite ? t.actions.removeFavorite : t.actions.addFavorite}
          </Button>
          <div className="flex gap-xs">
            <Button variant="secondary" onClick={onClose}>
              {t.actions.cancel}
            </Button>
            <Button variant="primary" onClick={onStart}>
              {primaryActionLabel(t, status)}
            </Button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-hairline-soft bg-canvas p-sm">
      <p className="text-caption text-steel">{label}</p>
      <p className="mt-xxs text-body-md-medium text-ink">{value}</p>
    </div>
  );
}

// --------------------------- Attempt detail modal -----------------------

function AttemptDetailModal({
  t,
  attempt,
  onClose,
  onRetry,
}: {
  t: FraudCopy;
  attempt: FraudAttemptRecord;
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <ModalShell
      title={t.attemptDetail.title}
      onClose={onClose}
      closeLabel={t.actions.close}
    >
      <div className="flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <span className="text-heading-3 font-display text-ink">
            {attempt.scenarioTitle}
          </span>
          <Badge variant="tag-purple">{typeLabel(t, attempt.fraudType)}</Badge>
        </div>
        <div
          className={cn(
            "rounded-2xl p-lg pastel flex items-center justify-between gap-md",
            attempt.passed
              ? "bg-success-accent/15 text-success-accent"
              : "bg-coral-light text-coral-dark",
          )}
        >
          <div>
            <p className="text-heading-5 font-display">
              {attempt.passed
                ? t.attemptDetail.passedLabel
                : t.attemptDetail.failedLabel}
            </p>
            <p className="text-caption-bold uppercase tracking-wide">
              {t.attemptDetail.dateLabel}: {attempt.attemptedAt}
            </p>
          </div>
          <div className="text-right">
            <p className="text-display-lg font-display leading-none">
              {attempt.score}
            </p>
            <p className="text-caption-bold uppercase tracking-wide">/ 100</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-sm">
          <Meta
            label={t.attemptDetail.detectedLabel}
            value={String(attempt.detectedFlags)}
          />
          <Meta
            label={t.attemptDetail.missedLabel}
            value={String(attempt.missedFlags)}
          />
        </div>
        <div className="flex justify-end gap-xs mt-xs">
          <Button variant="secondary" onClick={onClose}>
            {t.attemptDetail.close}
          </Button>
          <Button variant="primary" onClick={onRetry}>
            {t.attemptDetail.retry}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}

// --------------------------- Play overlay --------------------------------

function PlayOverlay({
  t,
  scenario,
  state,
  onChange,
  onSubmit,
  onBack,
  onRetry,
  onNext,
}: {
  t: FraudCopy;
  scenario: FraudSimScenario;
  state: PlayState;
  onChange: (s: PlayState) => void;
  onSubmit: () => void;
  onBack: () => void;
  onRetry: () => void;
  onNext: () => void;
}) {
  const steps: PlayPhase[] = ["intro", "evidence", "redflags", "decision", "result"];
  const activeIdx = steps.indexOf(state.phase);

  function goNext() {
    if (state.phase === "redflags" && state.selectedFlagIds.length === 0) {
      onChange({ ...state, validationError: t.play.redFlags.validation });
      return;
    }
    const nextIdx = activeIdx + 1;
    if (nextIdx < steps.length - 1) {
      onChange({
        ...state,
        phase: steps[nextIdx],
        validationError: null,
      });
    } else {
      onSubmit();
    }
  }

  function goPrev() {
    const prevIdx = Math.max(0, activeIdx - 1);
    onChange({
      ...state,
      phase: steps[prevIdx],
      validationError: null,
    });
  }

  function toggleFlag(id: string) {
    const has = state.selectedFlagIds.includes(id);
    onChange({
      ...state,
      validationError: null,
      selectedFlagIds: has
        ? state.selectedFlagIds.filter((x) => x !== id)
        : [...state.selectedFlagIds, id],
    });
  }

  return (
    <ModalShell
      title={scenario.title}
      onClose={onBack}
      closeLabel={t.actions.close}
      size="wide"
      stepIndicator={
        state.phase !== "result" ? (
          <StepIndicator t={t} phase={state.phase} />
        ) : undefined
      }
    >
      <div className="flex flex-col gap-lg min-h-[420px]">
        {state.phase === "intro" && (
          <IntroStep t={t} scenario={scenario} onStart={goNext} />
        )}
        {state.phase === "evidence" && (
          <EvidenceStep
            t={t}
            scenario={scenario}
            onNext={goNext}
            onBack={goPrev}
          />
        )}
        {state.phase === "redflags" && (
          <RedFlagsStep
            t={t}
            options={scenario.redFlagOptions}
            selected={state.selectedFlagIds}
            error={state.validationError}
            onToggle={toggleFlag}
            onNext={goNext}
            onBack={goPrev}
          />
        )}
        {state.phase === "decision" && (
          <DecisionStep
            t={t}
            options={scenario.decisionOptions}
            selectedId={state.selectedDecisionId}
            error={state.validationError}
            onSelect={(id) =>
              onChange({
                ...state,
                selectedDecisionId: id,
                validationError: null,
              })
            }
            onSubmit={goNext}
            onBack={goPrev}
          />
        )}
        {state.phase === "result" && state.result && (
          <ResultStep
            t={t}
            scenario={scenario}
            result={state.result}
            onRetry={onRetry}
            onNext={onNext}
            onClose={onBack}
          />
        )}
      </div>
    </ModalShell>
  );
}

function StepIndicator({ t, phase }: { t: FraudCopy; phase: PlayPhase }) {
  const steps: Array<{ id: PlayPhase; label: string }> = [
    { id: "intro", label: t.play.steps.situation },
    { id: "evidence", label: t.play.steps.evidence },
    { id: "redflags", label: t.play.steps.redFlags },
    { id: "decision", label: t.play.steps.decision },
  ];
  const idx = steps.findIndex((s) => s.id === phase);
  return (
    <ol className="flex items-center gap-xs flex-wrap">
      {steps.map((s, i) => {
        const active = i === idx;
        const done = i < idx;
        return (
          <li key={s.id} className="flex items-center gap-xs">
            <span
              className={cn(
                "inline-flex items-center justify-center w-6 h-6 rounded-full text-caption-bold",
                done && "bg-success-accent text-on-primary",
                active && "bg-primary text-on-primary dark:bg-on-primary dark:text-primary",
                !done && !active && "bg-surface text-steel",
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "text-caption-bold",
                active ? "text-ink" : "text-steel",
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <span className="w-6 h-px bg-hairline mx-xxs" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function IntroStep({
  t,
  scenario,
  onStart,
}: {
  t: FraudCopy;
  scenario: FraudSimScenario;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-micro-uppercase uppercase text-steel tracking-wide">
        {t.play.intro.eyebrow}
      </p>
      <p className="text-body-md text-charcoal">{scenario.context}</p>
      <div className="grid gap-sm md:grid-cols-2">
        <div className="rounded-xl bg-surface-soft p-md">
          <p className="text-caption-bold text-steel uppercase tracking-wide mb-xxs">
            {t.play.intro.roleLabel}
          </p>
          <p className="text-body-md text-ink">{scenario.learnerRole}</p>
        </div>
        <div className="rounded-xl bg-surface-soft p-md">
          <p className="text-caption-bold text-steel uppercase tracking-wide mb-xxs">
            {t.play.intro.taskLabel}
          </p>
          <p className="text-body-md text-ink">{scenario.task}</p>
        </div>
      </div>
      <div className="flex justify-end mt-sm">
        <Button variant="primary" onClick={onStart}>
          {t.play.intro.startCta}
        </Button>
      </div>
    </div>
  );
}

function EvidenceStep({
  t,
  scenario,
  onNext,
  onBack,
}: {
  t: FraudCopy;
  scenario: FraudSimScenario;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-micro-uppercase uppercase text-steel tracking-wide">
        {t.play.evidence.eyebrow}
      </p>
      <EvidenceView t={t} evidence={scenario.evidence} />
      <div className="flex items-center justify-between mt-sm">
        <Button variant="ghost" onClick={onBack}>
          {t.actions.goBack}
        </Button>
        <Button variant="primary" onClick={onNext}>
          {t.play.evidence.nextCta}
        </Button>
      </div>
    </div>
  );
}

function EvidenceView({
  t,
  evidence,
}: {
  t: FraudCopy;
  evidence: FraudEvidence;
}) {
  switch (evidence.kind) {
    case "phishing":
      return (
        <div className="rounded-xl border border-hairline-soft bg-canvas">
          <div className="border-b border-hairline-soft p-md">
            <p className="text-caption text-steel">
              {t.play.evidence.phishing.sender}:{" "}
              <span className="text-ink">
                {evidence.senderName} &lt;{evidence.senderEmail}&gt;
              </span>
            </p>
            <p className="text-caption text-steel">
              {t.play.evidence.phishing.received}:{" "}
              <span className="text-ink">{evidence.receivedAt}</span>
            </p>
            <p className="mt-xs text-body-md-medium text-ink">
              {evidence.subject}
            </p>
          </div>
          <div className="p-md text-body-md text-charcoal whitespace-pre-wrap">
            {evidence.body}
          </div>
          <div className="border-t border-hairline-soft p-md space-y-xs">
            <p className="text-caption text-steel">
              {t.play.evidence.phishing.link}:{" "}
              <span className="text-brand-blue break-all">{evidence.link}</span>
            </p>
            <p className="text-caption text-steel">
              {t.play.evidence.phishing.attachment}:{" "}
              <span className="text-ink">{evidence.attachment}</span>
            </p>
          </div>
        </div>
      );
    case "transaction": {
      const tr = t.play.evidence.transaction;
      return (
        <EvidenceGrid
          rows={[
            [tr.customer, evidence.customerName],
            [tr.accountAge, evidence.accountAge],
            [tr.amount, evidence.amount],
            [tr.destination, evidence.destinationCountry],
            [tr.frequency, evidence.frequency],
            [tr.description, evidence.description],
            [tr.usualBehavior, evidence.usualBehavior],
          ]}
        />
      );
    }
    case "document": {
      const doc = t.play.evidence.document;
      return (
        <div className="flex flex-col gap-md">
          <EvidenceGrid
            rows={[
              [doc.documentType, evidence.documentType],
              [doc.documentNumber, evidence.documentNumber],
              [doc.issueDate, evidence.issueDate],
              [doc.customerInfo, evidence.customerInfo],
            ]}
          />
          <div className="rounded-xl bg-coral-light/40 border border-coral-light p-md pastel">
            <p className="text-caption-bold text-coral-dark uppercase mb-xs">
              {doc.inconsistencies}
            </p>
            <ul className="list-disc pl-md space-y-xxs text-body-sm text-coral-dark">
              {evidence.inconsistencies.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    case "deepfake_call": {
      const df = t.play.evidence.deepfake;
      return (
        <div className="flex flex-col gap-md">
          <EvidenceGrid
            rows={[
              [df.callerName, evidence.callerName],
              [df.callerRole, evidence.callerRole],
              [df.urgency, evidence.urgency],
              [df.requestedAction, evidence.requestedAction],
            ]}
          />
          <div className="rounded-xl bg-surface-soft border border-hairline-soft p-md">
            <p className="text-caption-bold text-steel uppercase mb-xs">
              {df.transcript}
            </p>
            <p className="text-body-md text-charcoal whitespace-pre-wrap">
              “{evidence.transcript}”
            </p>
          </div>
          <div className="rounded-xl bg-rose-light/60 border border-coral-light p-md pastel">
            <p className="text-caption-bold text-coral-dark uppercase mb-xs">
              {df.suspiciousPhrases}
            </p>
            <ul className="list-disc pl-md space-y-xxs text-body-sm text-coral-dark">
              {evidence.suspiciousPhrases.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    case "social_engineering": {
      const so = t.play.evidence.social;
      return (
        <EvidenceGrid
          rows={[
            [so.actorIdentity, evidence.actorIdentity],
            [so.channel, evidence.channel],
            [so.requestedAction, evidence.requestedAction],
            [so.pressureTactic, evidence.pressureTactic],
            [so.policyHint, evidence.policyHint],
          ]}
        />
      );
    }
    case "aml_kyc": {
      const am = t.play.evidence.aml;
      return (
        <div className="flex flex-col gap-md">
          <EvidenceGrid
            rows={[
              [am.businessType, evidence.businessType],
              [am.sourceOfFunds, evidence.sourceOfFunds],
              [am.transactionPattern, evidence.transactionPattern],
              [am.beneficialOwner, evidence.beneficialOwner],
            ]}
          />
          <div className="rounded-xl bg-surface-yellow border border-brand-yellow-deep/40 p-md pastel">
            <p className="text-caption-bold text-yellow-dark uppercase mb-xs">
              {am.riskIndicators}
            </p>
            <ul className="list-disc pl-md space-y-xxs text-body-sm text-yellow-dark">
              {evidence.riskIndicators.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }
}

function EvidenceGrid({ rows }: { rows: ReadonlyArray<[string, string]> }) {
  return (
    <dl className="grid gap-x-lg gap-y-sm md:grid-cols-2 rounded-xl border border-hairline-soft bg-canvas p-md">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="text-caption text-steel">{k}</dt>
          <dd className="text-body-md text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function RedFlagsStep({
  t,
  options,
  selected,
  error,
  onToggle,
  onNext,
  onBack,
}: {
  t: FraudCopy;
  options: ReadonlyArray<RedFlagOption>;
  selected: ReadonlyArray<string>;
  error: string | null;
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-micro-uppercase uppercase text-steel tracking-wide">
        {t.play.redFlags.eyebrow}
      </p>
      <ul className="grid gap-xs md:grid-cols-2">
        {options.map((o) => {
          const checked = selected.includes(o.id);
          return (
            <li key={o.id}>
              <label
                className={cn(
                  "flex items-start gap-sm cursor-pointer rounded-md border px-md py-sm transition-colors",
                  checked
                    ? "border-brand-blue bg-surface-pricing-featured"
                    : "border-hairline-soft bg-canvas hover:bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(o.id)}
                  className="mt-[2px] w-[18px] h-[18px] accent-brand-blue"
                />
                <span className="text-body-md text-ink">{o.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {error && (
        <p role="alert" className="text-body-sm text-coral-dark">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between mt-sm">
        <Button variant="ghost" onClick={onBack}>
          {t.actions.goBack}
        </Button>
        <Button variant="primary" onClick={onNext}>
          {t.play.redFlags.nextCta}
        </Button>
      </div>
    </div>
  );
}

function DecisionStep({
  t,
  options,
  selectedId,
  error,
  onSelect,
  onSubmit,
  onBack,
}: {
  t: FraudCopy;
  options: ReadonlyArray<DecisionOption>;
  selectedId: string | null;
  error: string | null;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-md">
      <p className="text-micro-uppercase uppercase text-steel tracking-wide">
        {t.play.decision.eyebrow}
      </p>
      <ul className="grid gap-xs">
        {options.map((o) => {
          const checked = selectedId === o.id;
          return (
            <li key={o.id}>
              <label
                className={cn(
                  "flex items-center gap-sm cursor-pointer rounded-md border px-md py-sm transition-colors",
                  checked
                    ? "border-brand-blue bg-surface-pricing-featured"
                    : "border-hairline-soft bg-canvas hover:bg-surface",
                )}
              >
                <input
                  type="radio"
                  name="decision"
                  checked={checked}
                  onChange={() => onSelect(o.id)}
                  className="w-[18px] h-[18px] accent-brand-blue"
                />
                <span className="text-body-md text-ink">{o.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {error && (
        <p role="alert" className="text-body-sm text-coral-dark">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between mt-sm">
        <Button variant="ghost" onClick={onBack}>
          {t.actions.goBack}
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          {t.play.decision.submitCta}
        </Button>
      </div>
    </div>
  );
}

function ResultStep({
  t,
  scenario,
  result,
  onRetry,
  onNext,
  onClose,
}: {
  t: FraudCopy;
  scenario: FraudSimScenario;
  result: PlayResult;
  onRetry: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const flagById = new Map(scenario.redFlagOptions.map((f) => [f.id, f]));
  const decisionById = new Map(scenario.decisionOptions.map((d) => [d.id, d]));

  const detected = result.detectedFlagIds
    .map((id) => flagById.get(id)?.label)
    .filter((x): x is string => !!x);
  const missed = result.missedFlagIds
    .map((id) => flagById.get(id)?.label)
    .filter((x): x is string => !!x);
  const wrong = result.wrongFlagIds
    .map((id) => flagById.get(id)?.label)
    .filter((x): x is string => !!x);

  const learnerDecisionLabel =
    decisionById.get(result.learnerDecisionId)?.label ?? t.play.result.dash;
  const correctDecisionLabel =
    decisionById.get(result.correctDecisionId)?.label ?? t.play.result.dash;

  return (
    <div className="flex flex-col gap-md">
      <div
        className={cn(
          "rounded-2xl p-lg pastel flex items-center gap-md",
          result.passed
            ? "bg-success-accent/15 text-success-accent"
            : "bg-coral-light text-coral-dark",
        )}
      >
        <div
          className={cn(
            "inline-flex items-center justify-center w-14 h-14 rounded-full text-heading-4",
            result.passed
              ? "bg-success-accent text-on-primary"
              : "bg-coral-dark text-on-primary",
          )}
        >
          {result.passed ? "✓" : "!"}
        </div>
        <div className="min-w-0">
          <p className="text-heading-4 font-display">
            {result.passed
              ? t.play.result.passedTitle
              : t.play.result.failedTitle}
          </p>
          <p className="text-body-md">
            {result.passed
              ? t.play.result.passedBody
              : t.play.result.failedBody}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-display-lg font-display leading-none">
            {result.score}
          </p>
          <p className="text-caption-bold uppercase tracking-wide">/ 100</p>
        </div>
      </div>

      <div className="grid gap-md md:grid-cols-2">
        <ResultPanel
          title={t.play.result.detectedTitle}
          tone="success"
          items={detected.length > 0 ? detected : [t.play.result.nothingDetected]}
        />
        <ResultPanel
          title={t.play.result.missedTitle}
          tone="warning"
          items={missed.length > 0 ? missed : [t.play.result.dash]}
        />
      </div>

      {wrong.length > 0 && (
        <ResultPanel
          title={t.play.result.wrongTitle}
          tone="danger"
          items={wrong}
        />
      )}

      <div className="grid gap-md md:grid-cols-2">
        <div className="rounded-xl border border-hairline-soft bg-canvas p-md">
          <p className="text-caption-bold text-steel uppercase tracking-wide mb-xxs">
            {t.play.result.correctDecision}
          </p>
          <p className="text-body-md text-ink">{correctDecisionLabel}</p>
        </div>
        <div className="rounded-xl border border-hairline-soft bg-canvas p-md">
          <p className="text-caption-bold text-steel uppercase tracking-wide mb-xxs">
            {t.play.result.yourDecision}
          </p>
          <p
            className={cn(
              "text-body-md",
              result.learnerDecisionId === result.correctDecisionId
                ? "text-success-accent"
                : "text-coral-dark",
            )}
          >
            {learnerDecisionLabel}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-surface-soft p-md">
        <p className="text-caption-bold text-steel uppercase tracking-wide mb-xxs">
          {t.play.result.explanation}
        </p>
        <p className="text-body-md text-ink">{scenario.explanation}</p>
      </div>

      <div className="rounded-xl bg-surface-pricing-featured p-md">
        <p className="text-caption-bold text-brand-blue uppercase tracking-wide mb-xxs">
          {t.play.result.recommendation}
        </p>
        <p className="text-body-md text-ink">{scenario.recommendation}</p>
      </div>

      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-sm mt-xs">
        <Button variant="ghost" onClick={onClose}>
          {t.play.result.backToList}
        </Button>
        <div className="flex gap-xs">
          <Button variant="secondary" onClick={onRetry}>
            {t.play.result.retry}
          </Button>
          <Button variant="primary" onClick={onNext}>
            {t.play.result.nextScenario}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResultPanel({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "success" | "warning" | "danger";
  items: ReadonlyArray<string>;
}) {
  const tones: Record<typeof tone, string> = {
    success: "bg-success-accent/10 text-success-accent",
    warning: "bg-surface-yellow text-yellow-dark",
    danger: "bg-coral-light text-coral-dark",
  };
  return (
    <div className={cn("rounded-xl p-md pastel", tones[tone])}>
      <p className="text-caption-bold uppercase tracking-wide mb-xs">{title}</p>
      <ul className="list-disc pl-md space-y-xxs text-body-sm">
        {items.map((x, i) => (
          <li key={`${x}-${i}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}

// ----------------------------- Modal shell -------------------------------

function ModalShell({
  title,
  onClose,
  closeLabel,
  children,
  size = "default",
  stepIndicator,
}: {
  title: string;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
  size?: "default" | "wide";
  stepIndicator?: ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-primary/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full bg-canvas rounded-t-3xl md:rounded-3xl shadow-elev-4 overflow-hidden",
          size === "wide" ? "max-w-[920px]" : "max-w-[680px]",
          "max-h-[92vh] flex flex-col",
        )}
      >
        <div className="flex items-start justify-between gap-md p-lg border-b border-hairline-soft">
          <div className="min-w-0">
            <h2 className="text-heading-4 font-display text-ink truncate">
              {title}
            </h2>
            {stepIndicator && <div className="mt-sm">{stepIndicator}</div>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md text-steel hover:bg-surface"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path
                d="M3 3l8 8M11 3l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="p-lg overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
