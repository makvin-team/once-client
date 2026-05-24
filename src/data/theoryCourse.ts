// Theory Mode — the readable counterpart to the 3D Simulator.
//
// This file owns the STRUCTURE of the course: pillar ids, module ids,
// scenario ids, durations, accent colours. Locale-specific TEXT lives in
// ./theoryCourse/translations/<locale>.ts. The runtime hook
// `useTheoryCourse()` merges the two so a language switch re-renders the
// pages live, mirroring the simulator's pattern.

import { useMemo } from "react";
import { useLocale, type Locale } from "../i18n";
import { theoryCourseEn } from "./theoryCourse/translations/en";
import { theoryCourseUz } from "./theoryCourse/translations/uz";
import { theoryCourseUzCyrl } from "./theoryCourse/translations/uz-Cyrl";
import { theoryCourseRu } from "./theoryCourse/translations/ru";

export type TheoryPillarId = "aml" | "cyber" | "fraud" | "cx";

export type Severity = "critical" | "high" | "medium" | "low";

export type TheoryIndicator = {
  label: string;
  detail: string;
  severity: Severity;
};

export type TheoryAction = {
  label: string;
  rationale: string;
};

export type TheoryModule = {
  // structure (locale-independent)
  id: string;
  scenarioId: string;
  durationMinutes: number;
  // text (per-locale)
  title: string;
  subtitle: string;
  objective: string;
  overview: string;
  indicators: TheoryIndicator[];
  correctAction: TheoryAction;
  partialAction: TheoryAction;
  failAction: TheoryAction;
  takeaways: string[];
  references?: string[];
};

export type TheoryPillarAccent = {
  surface: string;
  border: string;
  chip: string;
  chipText: string;
  bar: string;
};

export type TheoryPillar = {
  // structure
  id: TheoryPillarId;
  priority: number;
  sessionMinutes: number;
  accent: TheoryPillarAccent;
  // text
  title: string;
  subtitle: string;
  description: string;
  modules: TheoryModule[];
};

// --- Structure ------------------------------------------------------------

const pillarAccent: Record<TheoryPillarId, TheoryPillarAccent> = {
  aml: {
    surface: "bg-coral-light",
    border: "border-brand-coral",
    chip: "bg-coral-light",
    chipText: "text-coral-dark",
    bar: "bg-brand-coral",
  },
  cyber: {
    surface: "bg-surface-pricing-featured",
    border: "border-brand-blue",
    chip: "bg-surface-pricing-featured",
    chipText: "text-brand-blue",
    bar: "bg-brand-blue",
  },
  fraud: {
    surface: "bg-yellow-light",
    border: "border-brand-yellow",
    chip: "bg-yellow-light",
    chipText: "text-yellow-dark",
    bar: "bg-brand-yellow-deep",
  },
  cx: {
    surface: "bg-teal-light",
    border: "border-brand-teal",
    chip: "bg-teal-light",
    chipText: "text-moss-dark",
    bar: "bg-brand-teal",
  },
};

export const pillarStructure: ReadonlyArray<{
  id: TheoryPillarId;
  priority: number;
  sessionMinutes: number;
  modules: ReadonlyArray<{
    id: string;
    scenarioId: string;
    durationMinutes: number;
  }>;
}> = [
  {
    id: "aml",
    priority: 1,
    sessionMinutes: 60,
    modules: [
      { id: "aml-m1", scenarioId: "amlSuspiciousTransaction", durationMinutes: 12 },
      { id: "aml-m2", scenarioId: "amlBeneficialOwner", durationMinutes: 10 },
      { id: "aml-m3", scenarioId: "amlSanctions", durationMinutes: 10 },
      { id: "aml-m4", scenarioId: "amlPep", durationMinutes: 8 },
      { id: "aml-m5", scenarioId: "amlSarWriting", durationMinutes: 14 },
    ],
  },
  {
    id: "cyber",
    priority: 2,
    sessionMinutes: 45,
    modules: [
      { id: "cyber-m1", scenarioId: "cyberPhishingTriage", durationMinutes: 10 },
      { id: "cyber-m2", scenarioId: "cyberSocTriage", durationMinutes: 12 },
      { id: "cyber-m3", scenarioId: "cyberIncidentResponse", durationMinutes: 15 },
      { id: "cyber-m4", scenarioId: "cyberZeroTrust", durationMinutes: 10 },
      { id: "cyber-m5", scenarioId: "cyberDeepfake", durationMinutes: 12 },
    ],
  },
  {
    id: "fraud",
    priority: 3,
    sessionMinutes: 40,
    modules: [
      { id: "fraud-m1", scenarioId: "fraudMuleAccount", durationMinutes: 9 },
      { id: "fraud-m2", scenarioId: "fraudSynthetic", durationMinutes: 11 },
      { id: "fraud-m3", scenarioId: "fraudSkimming", durationMinutes: 13 },
      { id: "fraud-m4", scenarioId: "fraudChargeback", durationMinutes: 9 },
      { id: "fraud-m5", scenarioId: "fraudAnomalyTuning", durationMinutes: 14 },
    ],
  },
  {
    id: "cx",
    priority: 4,
    sessionMinutes: 35,
    modules: [
      { id: "cx-m1", scenarioId: "cxAddressChange", durationMinutes: 8 },
      { id: "cx-m2", scenarioId: "cxAccountBlock", durationMinutes: 10 },
      { id: "cx-m3", scenarioId: "cxAccessibility", durationMinutes: 8 },
      { id: "cx-m4", scenarioId: "cxInternalEscalation", durationMinutes: 12 },
      { id: "cx-m5", scenarioId: "cxComplexCustomer", durationMinutes: 10 },
    ],
  },
];

// --- Translations contract -----------------------------------------------

export type PillarText = {
  title: string;
  subtitle: string;
  description: string;
};

export type ModuleText = {
  title: string;
  subtitle: string;
  objective: string;
  overview: string;
  indicators: Array<{ label: string; detail: string; severity: Severity }>;
  correctAction: TheoryAction;
  partialAction: TheoryAction;
  failAction: TheoryAction;
  takeaways: string[];
  references?: string[];
};

export type TheoryCourseUiStrings = {
  // Plans page
  eyebrow: string;
  pageTitle: string;
  pageDescription: string;
  pillarLabel: string; // e.g. "Pillar"
  modulesCount: (n: number, minutes: number) => string;
  open: string;
  // Pillar detail page
  breadcrumbRoot: string;
  pillarSubtitleLine: (priority: number, subtitle: string) => string;
  read: string;
  moduleMeta: (minutes: number, indicators: number) => string;
  aboutPillar: string;
  pillarSummary: (title: string, count: number) => string;
  aboutPillarLessons: (n: number) => string;
  aboutPillarMinutes: (m: number) => string;
  aboutPillarMaps: string;
  aboutPillarFooter: string;
  pillarNotFoundTitle: string;
  pillarNotFoundDescription: string;
  backToPillars: string;
  // Module page
  moduleEyebrow: (pillar: string, minutes: number) => string;
  learningObjective: string;
  sectionOverview: string;
  sectionIndicators: string;
  sectionDecision: string;
  sectionTakeaways: string;
  sectionReferences: string;
  severity: Record<Severity, string>;
  decisionCorrect: string;
  decisionPartial: string;
  decisionFail: string;
  pointsLabel: (n: string) => string;
  previousModule: string;
  nextModule: string;
  allPillarModules: (pillar: string) => string;
  lessonNotFoundTitle: string;
  lessonNotFoundDescription: string;
};

export type TheoryDictionary = {
  ui: TheoryCourseUiStrings;
  pillars: Record<TheoryPillarId, PillarText>;
  modules: Record<string, ModuleText>;
};

// --- Locale binding ------------------------------------------------------

const dictionaries: Record<Locale, TheoryDictionary> = {
  en: theoryCourseEn,
  uz: theoryCourseUz,
  "uz-Cyrl": theoryCourseUzCyrl,
  ru: theoryCourseRu,
};

function buildPillars(dict: TheoryDictionary): TheoryPillar[] {
  return pillarStructure.map((p) => {
    const pText = dict.pillars[p.id];
    const modules: TheoryModule[] = p.modules.map((m) => {
      const mText = dict.modules[m.id];
      return {
        id: m.id,
        scenarioId: m.scenarioId,
        durationMinutes: m.durationMinutes,
        title: mText.title,
        subtitle: mText.subtitle,
        objective: mText.objective,
        overview: mText.overview,
        indicators: mText.indicators,
        correctAction: mText.correctAction,
        partialAction: mText.partialAction,
        failAction: mText.failAction,
        takeaways: mText.takeaways,
        references: mText.references,
      };
    });
    return {
      id: p.id,
      priority: p.priority,
      sessionMinutes: p.sessionMinutes,
      accent: pillarAccent[p.id],
      title: pText.title,
      subtitle: pText.subtitle,
      description: pText.description,
      modules,
    };
  });
}

// --- Public hooks --------------------------------------------------------

export function useTheoryCourse(): {
  pillars: TheoryPillar[];
  ui: TheoryCourseUiStrings;
  getPillar: (id?: string) => TheoryPillar | undefined;
  getModule: (
    pillarId?: string,
    moduleId?: string,
  ) => { pillar: TheoryPillar; module: TheoryModule } | undefined;
  getAdjacentModule: (
    pillarId: string,
    moduleId: string,
    direction: "prev" | "next",
  ) => { pillarId: string; moduleId: string } | undefined;
} {
  const { locale } = useLocale();
  return useMemo(() => {
    const dict = dictionaries[locale] ?? dictionaries.en;
    const pillars = buildPillars(dict);

    const getPillar = (id?: string) =>
      id ? pillars.find((p) => p.id === id) : undefined;

    const getModule = (pillarId?: string, moduleId?: string) => {
      const pillar = getPillar(pillarId);
      if (!pillar || !moduleId) return undefined;
      const module = pillar.modules.find((m) => m.id === moduleId);
      if (!module) return undefined;
      return { pillar, module };
    };

    const getAdjacentModule = (
      pillarId: string,
      moduleId: string,
      direction: "prev" | "next",
    ) => {
      const pillar = getPillar(pillarId);
      if (!pillar) return undefined;
      const idx = pillar.modules.findIndex((m) => m.id === moduleId);
      if (idx < 0) return undefined;
      const target = direction === "next" ? idx + 1 : idx - 1;
      const m = pillar.modules[target];
      if (!m) return undefined;
      return { pillarId, moduleId: m.id };
    };

    return { pillars, ui: dict.ui, getPillar, getModule, getAdjacentModule };
  }, [locale]);
}
