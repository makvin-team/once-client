import { useEffect, useState } from "react"
import { API_BASE_URL } from "../lib/api"
import { fraudService, type BackendStats, type SubmitAttemptPayload } from "../services/fraud.service"
import {
  mockFraudScenarios,
  mockLearnerAttempts,
  mockLearnerStats,
  type FraudAttemptRecord,
  type FraudSimScenario,
} from "../data/fraudSim"

// fraudType bo'yicha mock play content lookup (evidence, redFlags, decisions, ...)
const MOCK_PLAY_BY_TYPE = Object.fromEntries(
  mockFraudScenarios.map((m) => [m.fraudType, m])
) as Record<string, (typeof mockFraudScenarios)[number]>

function enrichWithPlayContent(scenarios: FraudSimScenario[]): FraudSimScenario[] {
  return scenarios.map((s) => {
    const mock = MOCK_PLAY_BY_TYPE[s.fraudType]
    if (!mock) return s
    return {
      ...s,
      context:        mock.context,
      task:           mock.task,
      skills:         mock.skills,
      evidence:       mock.evidence,
      redFlagOptions: mock.redFlagOptions,
      decisionOptions: mock.decisionOptions,
      explanation:    mock.explanation,
      recommendation: mock.recommendation,
    }
  })
}

export type { SubmitAttemptPayload }

export type FraudStats = {
  totalAttempts: number
  averageScore: number
  bestScore: number
  passedCount: number
  failedCount: number
}

type UseFraudDataResult = {
  scenarios: FraudSimScenario[]
  stats: FraudStats
  attempts: FraudAttemptRecord[]
  loading: boolean
  apiAvailable: boolean
  submitAttempt: (payload: SubmitAttemptPayload) => Promise<FraudAttemptRecord | null>
}

function mapStats(b: BackendStats): FraudStats {
  return {
    totalAttempts: b.totalAttempts,
    averageScore: b.averageScore,
    bestScore: b.bestScore,
    passedCount: b.passedCount,
    failedCount: b.failedCount,
  }
}

export function useFraudData(locale: string): UseFraudDataResult {
  const [scenarios, setScenarios] = useState<FraudSimScenario[]>(mockFraudScenarios as FraudSimScenario[])
  const [stats, setStats]         = useState<FraudStats>({ ...mockLearnerStats })
  const [attempts, setAttempts]   = useState<FraudAttemptRecord[]>([...mockLearnerAttempts])
  const [loading, setLoading]     = useState(!!API_BASE_URL)
  const [apiAvailable, setApiAvailable] = useState(false)

  useEffect(() => {
    if (!API_BASE_URL) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    Promise.all([
      fraudService.getScenarios(locale),
      fraudService.getStats(),
      fraudService.getAttempts(locale),
    ])
      .then(([s, st, a]) => {
        const enriched = enrichWithPlayContent(s)
        setScenarios(enriched.length > 0 ? enriched : (mockFraudScenarios as FraudSimScenario[]))
        setStats(mapStats(st))
        setAttempts(a)
        setApiAvailable(true)
      })
      .catch(() => {
        // API xato bersa mock data qoladi
      })
      .finally(() => {
        setLoading(false)
      })
  }, [locale])

  async function submitAttempt(payload: SubmitAttemptPayload): Promise<FraudAttemptRecord | null> {
    if (!apiAvailable) return null
    try {
      const record = await fraudService.submitAttempt(payload)
      setAttempts((prev) => [record, ...prev])
      return record
    } catch {
      return null
    }
  }

  return { scenarios, stats, attempts, loading, apiAvailable, submitAttempt }
}
