import { http } from './http'

import type { Attachment, Message } from '@/types/message'

export interface CreateMessageInput {
  senderId: string
  body: string
  replyToMessageId?: string
  attachments?: Attachment[]
}

export async function getMessages(conversationId: string) {
  const response = await http.get<Message[]>(`/conversations/${conversationId}/messages`)
  return response.data
}

export async function createMessage(conversationId: string, input: CreateMessageInput) {
  const response = await http.post<Message>(`/conversations/${conversationId}/messages`, input)
  return response.data
}

export async function updateMessage(messageId: string, body: string) {
  const response = await http.patch<Message>(`/messages/${messageId}`, { body })
  return response.data
}

export async function deleteMessage(messageId: string) {
  await http.delete(`/messages/${messageId}`)
}

export async function markMessageRead(messageId: string) {
  const response = await http.patch<Message>(`/messages/${messageId}/read`)
  return response.data
}

export async function toggleMessageReaction(messageId: string, emoji: string, userId: string) {
  const response = await http.patch<Message>(`/messages/${messageId}/reactions`, { emoji, userId })
  return response.data
}

export async function searchMessages(query: string) {
  const response = await http.get<Message[]>('/search/messages', {
    params: {
      q: query
    }
  })
  return response.data
}
