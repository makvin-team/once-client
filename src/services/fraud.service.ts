import { authFetch } from "../lib/api"
import type {
  FraudAttemptRecord,
  FraudEvidence,
  FraudSimScenario,
  FraudSimStatus,
} from "../data/fraudSim"

// ---- raw shapes from the backend ----------------------------------------

type BackendScenario = {
  id: number
  title: string
  description: string
  fraudType: string
  difficulty: string
  riskLevel: string
  estimatedMinutes: number
  passScore: number
  averageScore: number
  attemptsCount: number
  updatedAt: string
  learnerRole: string
  previousBest?: number | null
  initialStatus?: string | null
  playUrl?: string | null
}

type BackendAttempt = {
  id: number
  scenarioId: number
  scenarioTitle: string
  fraudType: string
  score: number
  passed: boolean
  detectedFlags: number
  missedFlags: number
  attemptedAt: string
}

export type BackendStats = {
  totalAttempts: number
  averageScore: number
  bestScore: number
  passedCount: number
  failedCount: number
}

export type SubmitAttemptPayload = {
  scenarioId: string
  score: number
  passed: boolean
  detectedFlags: number
  missedFlags: number
  selectedDecisionId: string
  selectedFlagIds: ReadonlyArray<string>
}

// ---- mappers -------------------------------------------------------------

function mapScenario(b: BackendScenario): FraudSimScenario {
  return {
    id: b.id.toString(),
    title: b.title,
    description: b.description,
    fraudType: b.fraudType as FraudSimScenario["fraudType"],
    difficulty: b.difficulty as FraudSimScenario["difficulty"],
    riskLevel: b.riskLevel as FraudSimScenario["riskLevel"],
    estimatedMinutes: b.estimatedMinutes,
    passScore: b.passScore,
    averageScore: b.averageScore,
    attempts: b.attemptsCount,
    updatedAt: b.updatedAt,
    learnerRole: b.learnerRole,
    // play-mode fields not served by API — use mock data for simulation
    skills: [],
    context: "",
    task: "",
    evidence: {} as FraudEvidence,
    redFlagOptions: [],
    decisionOptions: [],
    explanation: "",
    recommendation: "",
    previousBest: b.previousBest ?? undefined,
    initialStatus: (b.initialStatus ?? "not_started") as FraudSimStatus,
    playUrl: b.playUrl ?? undefined,
  }
}

function mapAttempt(b: BackendAttempt): FraudAttemptRecord {
  return {
    id: b.id.toString(),
    scenarioId: b.scenarioId.toString(),
    scenarioTitle: b.scenarioTitle,
    fraudType: b.fraudType as FraudAttemptRecord["fraudType"],
    score: b.score,
    passed: b.passed,
    detectedFlags: b.detectedFlags,
    missedFlags: b.missedFlags,
    attemptedAt: b.attemptedAt,
  }
}

// ---- admin types --------------------------------------------------------

export type MultiLangValue = {
  uz: string | null
  ru: string | null
  en: string | null
  cyrl: string | null
}

export type AdminFraudScenario = {
  id: number
  title: MultiLangValue
  description: MultiLangValue
  learnerRole: MultiLangValue
  fraudType: string
  difficulty: string
  riskLevel: string
  estimatedMinutes: number
  passScore: number
  averageScore: number
  attemptsCount: number
  updatedAt: string
  playUrl?: string | null
}

export type UpdateFraudScenarioPayload = {
  title: MultiLangValue
  description: MultiLangValue
  learnerRole: MultiLangValue
  playUrl?: string | null
  estimatedMinutes: number
  passScore: number
}

// ---- service -------------------------------------------------------------

async function getJson<T>(path: string, locale?: string): Promise<T> {
  const headers = locale ? { "Accept-Language": locale.toUpperCase() } : undefined
  const res = await authFetch(path, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export const fraudService = {
  getScenarios: async (locale: string): Promise<FraudSimScenario[]> => {
    const data = await getJson<BackendScenario[]>("/api/fraud/scenarios", locale)
    return data.map(mapScenario)
  },

  getStats: async (): Promise<BackendStats> => {
    return getJson<BackendStats>("/api/fraud/stats")
  },

  getAttempts: async (locale: string): Promise<FraudAttemptRecord[]> => {
    const data = await getJson<BackendAttempt[]>("/api/fraud/attempts", locale)
    return data.map(mapAttempt)
  },

  getAdminScenarios: async (): Promise<AdminFraudScenario[]> => {
    // Send Accept-Language: ALL so the converter returns full multilang objects
    return getJson<AdminFraudScenario[]>("/api/admin/fraud/scenarios", "ALL")
  },

  updateScenario: async (id: number, data: UpdateFraudScenarioPayload): Promise<void> => {
    const res = await authFetch(`/api/admin/fraud/scenarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  },

  submitAttempt: async (payload: SubmitAttemptPayload): Promise<FraudAttemptRecord> => {
    const res = await authFetch("/api/fraud/attempts", {
      method: "POST",
      body: JSON.stringify({
        scenarioId: Number(payload.scenarioId),
        score: payload.score,
        passed: payload.passed,
        detectedFlags: payload.detectedFlags,
        missedFlags: payload.missedFlags,
        selectedDecisionId: payload.selectedDecisionId,
        selectedFlagIds: [...payload.selectedFlagIds],
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as BackendAttempt
    return mapAttempt(data)
  },
}
