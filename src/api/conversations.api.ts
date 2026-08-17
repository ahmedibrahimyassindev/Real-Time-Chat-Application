import { http } from './http'

export async function getConversations() {
  const response = await http.get('/conversations')
  return response.data
}
