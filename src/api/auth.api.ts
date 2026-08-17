import { http } from './http'
import { mapUser, type BackendUser } from './backendAdapters'

import type { LoginInput, RegisterInput } from '@/schemas/auth.schema'

interface BackendAuthResponse {
  accessToken: string
  user: BackendUser
}

export async function login(input: LoginInput) {
  const response = await http.post<BackendAuthResponse>('/auth/login', input)
  return {
    token: response.data.accessToken,
    user: mapUser(response.data.user)
  }
}

export async function register(input: RegisterInput) {
  const response = await http.post<BackendAuthResponse>('/auth/register', {
    name: input.name,
    email: input.email,
    password: input.password
  })

  return {
    token: response.data.accessToken,
    user: mapUser(response.data.user)
  }
}

export async function getSessionUser() {
  const response = await http.get<BackendUser>('/users/me')
  return mapUser(response.data)
}
