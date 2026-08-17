import { http } from './http'

import type { Conversation } from '@/types/conversation'

export async function getConversations() {
  const response = await http.get<Conversation[]>('/conversations')
  return response.data
}
