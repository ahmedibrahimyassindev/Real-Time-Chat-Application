import { http } from './http'
import { mapChannel, mapConversation, type BackendConversation } from './backendAdapters'

export interface ChannelInput {
  name: string
  description?: string
  isPrivate: boolean
}

export interface CreateChannelInput extends ChannelInput {
  userId: string
}

export async function getChannels() {
  const response = await http.get<BackendConversation[]>('/conversations')
  return response.data.filter((conversation) => conversation.type === 'CHANNEL').map(mapChannel)
}

export async function createChannel(input: CreateChannelInput) {
  const response = await http.post<BackendConversation>('/conversations', {
    type: 'CHANNEL',
    name: input.name,
    description: input.description,
    isPrivate: input.isPrivate,
    memberIds: [input.userId]
  })

  return {
    channel: mapChannel(response.data),
    conversation: mapConversation(response.data)
  }
}

export async function updateChannel(channelId: string, input: ChannelInput) {
  const response = await http.patch<BackendConversation>(`/channels/${channelId}`, input)
  return mapChannel(response.data)
}

export async function setChannelMembers(channelId: string, memberIds: string[]) {
  const response = await http.patch<BackendConversation>(`/channels/${channelId}/members`, {
    memberIds
  })
  return mapChannel(response.data)
}
