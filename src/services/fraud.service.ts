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
  skills: string[]
  context: string
  learnerRole: string
  task: string
  evidence: unknown
  redFlagOptions: Array<{ id: string; label: string; correct: boolean }>
  decisionOptions: Array<{ id: string; label: string; correct: boolean }>
  explanation: string
  recommendation: string
  previousBest?: number | null
  initialStatus?: string | null
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
    skills: b.skills,
    context: b.context,
    learnerRole: b.learnerRole,
    task: b.task,
    evidence: b.evidence as FraudEvidence,
    redFlagOptions: b.redFlagOptions,
    decisionOptions: b.decisionOptions,
    explanation: b.explanation,
    recommendation: b.recommendation,
    previousBest: b.previousBest ?? undefined,
    initialStatus: (b.initialStatus ?? "not_started") as FraudSimStatus,
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

// ---- service -------------------------------------------------------------

async function getJson<T>(path: string): Promise<T> {
  const res = await authFetch(path)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export const fraudService = {
  getScenarios: async (): Promise<FraudSimScenario[]> => {
    const data = await getJson<BackendScenario[]>("/api/fraud/scenarios")
    return data.map(mapScenario)
  },

  getStats: async (): Promise<BackendStats> => {
    return getJson<BackendStats>("/api/fraud/stats")
  },

  getAttempts: async (): Promise<FraudAttemptRecord[]> => {
    const data = await getJson<BackendAttempt[]>("/api/fraud/attempts")
    return data.map(mapAttempt)
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
