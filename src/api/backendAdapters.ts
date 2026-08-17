import type { Channel } from '@/types/channel'
import type { Conversation } from '@/types/conversation'
import type { Message, MessageReaction } from '@/types/message'
import type { User } from '@/types/user'

export interface BackendUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
}

export interface BackendConversation {
  id: string
  type: 'DIRECT' | 'CHANNEL'
  name: string | null
  description?: string | null
  isPrivate: boolean
  updatedAt: string
  members: Array<{
    userId: string
    user: BackendUser
  }>
  messages?: BackendMessage[]
}

export interface BackendMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  replyToId: string | null
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  reactions: Array<{
    emoji: string
    userId: string
  }>
  reads: Array<{
    userId: string
  }>
}

export function mapUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    status: 'offline'
  }
}

function isFrontendConversation(
  conversation: BackendConversation | Conversation
): conversation is Conversation {
  return 'memberIds' in conversation && 'title' in conversation
}

function isFrontendChannel(conversation: BackendConversation | Channel): conversation is Channel {
  return 'memberIds' in conversation && 'name' in conversation
}

function isFrontendMessage(message: BackendMessage | Message): message is Message {
  return 'body' in message
}

export function mapConversation(conversation: BackendConversation | Conversation): Conversation {
  if (isFrontendConversation(conversation)) {
    return conversation
  }

  const latestMessage = conversation.messages?.[0]

  return {
    id: conversation.id,
    type: conversation.type === 'DIRECT' ? 'direct' : 'channel',
    title: conversation.name ?? conversation.members.map((member) => member.user.name).join(', '),
    memberIds: conversation.members.map((member) => member.userId),
    channelId: conversation.type === 'CHANNEL' ? conversation.id : undefined,
    lastMessageId: latestMessage?.id,
    unreadCount: 0,
    updatedAt: conversation.updatedAt
  }
}

export function mapChannel(conversation: BackendConversation | Channel): Channel {
  if (isFrontendChannel(conversation)) {
    return conversation
  }

  return {
    id: conversation.id,
    name: conversation.name ?? 'Untitled channel',
    description: conversation.description ?? undefined,
    isPrivate: conversation.isPrivate,
    memberIds: conversation.members.map((member) => member.userId)
  }
}

export function mapMessage(message: BackendMessage | Message): Message {
  if (isFrontendMessage(message)) {
    return message
  }

  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    body: message.deletedAt ? '' : message.content,
    replyToMessageId: message.replyToId ?? undefined,
    status: message.reads.length > 0 ? 'read' : 'sent',
    reactions: groupReactions(message.reactions),
    attachments: [],
    createdAt: message.createdAt,
    updatedAt: message.updatedAt
  }
}

function groupReactions(reactions: BackendMessage['reactions']): MessageReaction[] {
  const grouped = new Map<string, Set<string>>()

  reactions.forEach((reaction) => {
    const userIds = grouped.get(reaction.emoji) ?? new Set<string>()
    userIds.add(reaction.userId)
    grouped.set(reaction.emoji, userIds)
  })

  return Array.from(grouped.entries()).map(([emoji, userIds]) => ({
    emoji,
    count: userIds.size,
    userIds: Array.from(userIds)
  }))
}
