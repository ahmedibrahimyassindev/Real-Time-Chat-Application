import { http } from './http'
import { mapUser, type BackendUser } from './backendAdapters'

export async function getCurrentUser() {
  const response = await http.get<BackendUser>('/users/me')
  return mapUser(response.data)
}

export async function getUsers() {
  const response = await http.get<BackendUser[]>('/users')
  return response.data.map(mapUser)
}
