import { useEffect, useState } from 'react'
import { refreshTokens } from '../../../lib/api'
import { profileService } from '../services/profile.service'
import type { ChangePasswordRequest, ProfileResponse, UpdateProfileRequest } from '../types'

export function useProfile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const fetchProfile = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileService.getProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProfile()
  }, [])

  const updateProfile = async (data: UpdateProfileRequest): Promise<boolean> => {
    setSaving(true)
    setSaveError(null)
    try {
      const updated = await profileService.updateProfile(data)
      setProfile(updated)
      void refreshTokens()
      return true
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      return false
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (data: ChangePasswordRequest): Promise<boolean> => {
    setPasswordSaving(true)
    setPasswordError(null)
    setPasswordSuccess(false)
    try {
      await profileService.changePassword(data)
      setPasswordSuccess(true)
      return true
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      return false
    } finally {
      setPasswordSaving(false)
    }
  }

  return {
    profile,
    loading,
    error,
    saving,
    saveError,
    passwordSaving,
    passwordError,
    passwordSuccess,
    fetchProfile,
    updateProfile,
    changePassword,
  }
}
