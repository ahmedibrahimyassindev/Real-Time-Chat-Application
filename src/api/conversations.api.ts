import { http } from './http'
import { mapConversation, type BackendConversation } from './backendAdapters'

export async function getConversations() {
  const response = await http.get<BackendConversation[]>('/conversations')
  return response.data.map(mapConversation)
}
