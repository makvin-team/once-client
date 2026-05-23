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

export function useFraudData(): UseFraudDataResult {
  const [scenarios, setScenarios] = useState<FraudSimScenario[]>(mockFraudScenarios as FraudSimScenario[])
  const [stats, setStats]         = useState<FraudStats>({ ...mockLearnerStats })
  const [attempts, setAttempts]   = useState<FraudAttemptRecord[]>([...mockLearnerAttempts])
  const [loading, setLoading]     = useState(!!API_BASE_URL)
  const [apiAvailable, setApiAvailable] = useState(false)

  useEffect(() => {
    if (!API_BASE_URL) return

    Promise.all([
      fraudService.getScenarios(),
      fraudService.getStats(),
      fraudService.getAttempts(),
    ])
      .then(([s, st, a]) => {
        setScenarios(s.length > 0 ? s : (mockFraudScenarios as FraudSimScenario[]))
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
  }, [])

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
