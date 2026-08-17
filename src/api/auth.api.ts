import { http } from './http'

import type { LoginInput, RegisterInput } from '@/schemas/auth.schema'
import type { User } from '@/types/user'

export async function login(input: LoginInput) {
  const response = await http.post<{ user: User; token: string }>('/auth/login', input)
  return response.data
}

export async function register(input: RegisterInput) {
  const response = await http.post<{ user: User; token: string }>('/auth/register', input)
  return response.data
}

export async function getSessionUser() {
  const response = await http.get<User>('/me')
  return response.data
}
