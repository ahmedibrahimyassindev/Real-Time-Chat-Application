import type { Conversation } from '@/types/conversation'

export const mockConversations: Conversation[] = [
  {
    id: 'conversation-sarah',
    type: 'direct',
    title: 'Sarah Hassan',
    memberIds: ['user-ahmed', 'user-sarah'],
    lastMessageId: 'message-2',
    unreadCount: 1,
    updatedAt: '2026-08-17T09:15:00.000Z'
  },
  {
    id: 'conversation-general',
    type: 'channel',
    title: '#general',
    memberIds: ['user-ahmed', 'user-sarah', 'user-mohamed', 'user-nour'],
    channelId: 'channel-general',
    lastMessageId: 'message-4',
    unreadCount: 0,
    updatedAt: '2026-08-17T09:10:00.000Z'
  },
  {
    id: 'conversation-frontend',
    type: 'channel',
    title: '#frontend',
    memberIds: ['user-ahmed', 'user-sarah'],
    channelId: 'channel-frontend',
    lastMessageId: 'message-6',
    unreadCount: 0,
    updatedAt: '2026-08-17T08:45:00.000Z'
  }
]
