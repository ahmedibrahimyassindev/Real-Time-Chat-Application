import { http } from './http'
import { mapMessage, type BackendMessage } from './backendAdapters'

import type { Attachment, Message } from '@/types/message'

export interface MessagePage {
  items: Message[]
  nextCursor: string | null
}

export interface CreateMessageInput {
  senderId: string
  body: string
  replyToMessageId?: string
  attachments?: Attachment[]
}

export async function getMessages(
  conversationId: string,
  options: { cursor?: string | null; limit?: number } = {}
) {
  const response = await http.get<{ items: BackendMessage[]; nextCursor: string | null }>(
    `/conversations/${conversationId}/messages`,
    {
      params: {
        cursor: options.cursor,
        limit: options.limit
      }
    }
  )

  return {
    items: response.data.items.map(mapMessage),
    nextCursor: response.data.nextCursor
  }
}

export async function createMessage(conversationId: string, input: CreateMessageInput) {
  const response = await http.post<BackendMessage>(`/conversations/${conversationId}/messages`, {
    content: input.body,
    replyToId: input.replyToMessageId
  })
  return mapMessage(response.data)
}

export async function updateMessage(messageId: string, body: string) {
  const response = await http.patch<BackendMessage>(`/messages/${messageId}`, { content: body })
  return mapMessage(response.data)
}

export async function deleteMessage(messageId: string) {
  const response = await http.delete<BackendMessage>(`/messages/${messageId}`)
  return mapMessage(response.data)
}

export async function markMessageRead(messageId: string) {
  const response = await http.post<{ messageId: string }>(`/messages/${messageId}/read`)
  return response.data
}

export async function toggleMessageReaction(messageId: string, emoji: string, userId: string) {
  void userId

  const response = await http.post(`/messages/${messageId}/reactions`, { emoji })
  return response.data
}

export async function searchMessages(query: string) {
  const response = await http.get<BackendMessage[]>('/search/messages', {
    params: {
      q: query
    }
  })
  return response.data.map(mapMessage)
}
