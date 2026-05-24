import { authFetch } from '../../../lib/api'
import type { ChangePasswordRequest, ProfileResponse, UpdateProfileRequest } from '../types'

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => ({}))
  return (body as { title?: string; detail?: string }).detail
    ?? (body as { title?: string }).title
    ?? 'Xatolik yuz berdi'
}

export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const res = await authFetch('/api/profile')
    if (!res.ok) throw new Error(await parseError(res))
    return res.json() as Promise<ProfileResponse>
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    const res = await authFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await parseError(res))
    return res.json() as Promise<ProfileResponse>
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    const res = await authFetch('/api/profile/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await parseError(res))
  },
}
