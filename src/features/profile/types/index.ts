export type ProfileResponse = {
  id: number
  username: string
  firstName: string
  lastName: string
  phoneNumber: string | null
  role: string
  isActive: boolean
  createdAt: string
  branchId: number | null
  branchName: string | null
  positionId: number | null
  positionName: string | null
}

export type UpdateProfileRequest = {
  firstName: string
  lastName: string
  phoneNumber: string | null
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}
