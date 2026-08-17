import { http } from './http'

import type { User } from '@/types/user'

export async function getCurrentUser() {
  const response = await http.get<User>('/me')
  return response.data
}
