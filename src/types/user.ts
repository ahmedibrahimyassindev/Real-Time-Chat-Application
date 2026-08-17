export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  status: UserStatus
}
