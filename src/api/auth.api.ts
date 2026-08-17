import { http } from './http'

import type { LoginInput } from '@/schemas/auth.schema'
import type { User } from '@/types/user'

export async function login(input: LoginInput) {
  const response = await http.post<{ user: User; token: string }>('/auth/login', input)
  return response.data
}
