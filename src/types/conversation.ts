export type ConversationType = 'direct' | 'channel'

export interface Conversation {
  id: string
  type: ConversationType
  title: string
  memberIds: string[]
  channelId?: string
  lastMessageId?: string
  unreadCount: number
  updatedAt: string
}
