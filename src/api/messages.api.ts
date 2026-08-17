import { http } from './http'

import type { Message } from '@/types/message'

export async function getMessages(conversationId: string) {
  const response = await http.get<Message[]>(`/conversations/${conversationId}/messages`)
  return response.data
}
