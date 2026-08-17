import { http } from './http'

import type { Channel } from '@/types/channel'
import type { Conversation } from '@/types/conversation'

export interface ChannelInput {
  name: string
  description?: string
  isPrivate: boolean
}

export interface CreateChannelInput extends ChannelInput {
  userId: string
}

export async function getChannels() {
  const response = await http.get<Channel[]>('/channels')
  return response.data
}

export async function createChannel(input: CreateChannelInput) {
  const response = await http.post<{ channel: Channel; conversation: Conversation }>(
    '/channels',
    input
  )
  return response.data
}

export async function updateChannel(channelId: string, input: ChannelInput) {
  const response = await http.patch<Channel>(`/channels/${channelId}`, input)
  return response.data
}

export async function setChannelMembers(channelId: string, memberIds: string[]) {
  const response = await http.patch<Channel>(`/channels/${channelId}/members`, { memberIds })
  return response.data
}
