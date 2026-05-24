import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Field } from '../../../components/ui/Field'
import { Input } from '../../../components/ui/Input'
import { useProfile } from '../hooks/useProfile'
import type { ChangePasswordRequest, UpdateProfileRequest } from '../types'

type ProfileFormState = {
  firstName: string
  lastName: string
  phoneNumber: string
}

type PasswordFormState = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-5 w-40 rounded bg-hairline-soft" />
      <div className="h-[44px] w-full rounded-md bg-hairline-soft" />
      <div className="h-[44px] w-full rounded-md bg-hairline-soft" />
      <div className="h-[44px] w-full rounded-md bg-hairline-soft" />
    </div>
  )
}

export function ProfileSettings() {
  const {
    profile,
    loading,
    error,
    saving,
    saveError,
    passwordSaving,
    passwordError,
    passwordSuccess,
    updateProfile,
    changePassword,
  } = useProfile()

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const [saveSuccess, setSaveSuccess] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber ?? '',
      })
    }
  }, [profile])

  useEffect(() => {
    if (passwordSuccess) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setConfirmError(null)
    }
  }, [passwordSuccess])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const request: UpdateProfileRequest = {
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      phoneNumber: profileForm.phoneNumber.trim() || null,
    }
    const ok = await updateProfile(request)
    if (ok) {
      setSaveSuccess(true)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setConfirmError('Yangi parol va tasdiqlash mos kelmaydi')
      return
    }
    setConfirmError(null)
    const request: ChangePasswordRequest = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }
    await changePassword(request)
  }

  const setProfileField =
    (field: keyof ProfileFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const setPasswordField =
    (field: keyof PasswordFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }))
    }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-5">
        {/* Personal info */}
        <section className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="mb-5 text-body-md-medium text-ink">Ma&apos;lumotlarni tahrirlash</h2>

          {loading ? (
            <Skeleton />
          ) : error ? (
            <p className="text-body-sm text-coral-dark">{error}</p>
          ) : (
            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <Field label="Ism" htmlFor="firstName" required>
                <Input
                  id="firstName"
                  value={profileForm.firstName}
                  onChange={setProfileField('firstName')}
                  placeholder="Ismingiz"
                  required
                />
              </Field>

              <Field label="Familiya" htmlFor="lastName" required>
                <Input
                  id="lastName"
                  value={profileForm.lastName}
                  onChange={setProfileField('lastName')}
                  placeholder="Familiyangiz"
                  required
                />
              </Field>

              <Field label="Telefon raqam" htmlFor="phoneNumber">
                <Input
                  id="phoneNumber"
                  value={profileForm.phoneNumber}
                  onChange={setProfileField('phoneNumber')}
                  placeholder="+998 90 000 00 00"
                />
              </Field>

              {saveError && (
                <p className="text-body-sm text-coral-dark">{saveError}</p>
              )}
              {saveSuccess && (
                <p className="text-body-sm text-teal-700">Saqlandi</p>
              )}

              <div>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Change password */}
        <section className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="mb-5 text-body-md-medium text-ink">Parolni o&apos;zgartirish</h2>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <Field label="Joriy parol" htmlFor="currentPassword" required>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={setPasswordField('currentPassword')}
                placeholder="••••••••"
                required
              />
            </Field>

            <Field label="Yangi parol" htmlFor="newPassword" required>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={setPasswordField('newPassword')}
                placeholder="••••••••"
                required
              />
            </Field>

            <Field label="Yangi parolni tasdiqlang" htmlFor="confirmPassword" required error={confirmError ?? undefined}>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => {
                  setPasswordField('confirmPassword')(e)
                  if (confirmError) setConfirmError(null)
                }}
                placeholder="••••••••"
                required
              />
            </Field>

            {passwordError && (
              <p className="text-body-sm text-coral-dark">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-body-sm text-teal-700">Parol o&apos;zgartirildi</p>
            )}

            <div>
              <Button type="submit" variant="primary" disabled={passwordSaving}>
                {passwordSaving ? 'Saqlanmoqda...' : "O'zgartirish"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
