import type { Message } from '@/types/message'

export const mockMessages: Message[] = [
  {
    id: 'message-1',
    conversationId: 'conversation-sarah',
    senderId: 'user-ahmed',
    body: 'Can you review the message composer layout?',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T09:00:00.000Z'
  },
  {
    id: 'message-2',
    conversationId: 'conversation-sarah',
    senderId: 'user-sarah',
    body: 'Yes, @ahmed I will check spacing and mobile behavior today.',
    status: 'delivered',
    reactions: [{ emoji: '👍', count: 1, userIds: ['user-ahmed'] }],
    attachments: [],
    createdAt: '2026-08-17T09:15:00.000Z'
  },
  {
    id: 'message-3',
    conversationId: 'conversation-general',
    senderId: 'user-mohamed',
    body: 'Daily sync notes are ready in the planning thread.',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T08:55:00.000Z'
  },
  {
    id: 'message-7',
    conversationId: 'conversation-general',
    senderId: 'user-nour',
    body: 'I added the first pass of notification copy.',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T08:10:00.000Z'
  },
  {
    id: 'message-8',
    conversationId: 'conversation-general',
    senderId: 'user-sarah',
    body: 'The empty states should stay direct and actionable.',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T08:20:00.000Z'
  },
  {
    id: 'message-9',
    conversationId: 'conversation-general',
    senderId: 'user-mohamed',
    body: 'I will prepare a small search fixture for the next phase.',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T08:35:00.000Z'
  },
  {
    id: 'message-4',
    conversationId: 'conversation-general',
    senderId: 'user-ahmed',
    body: 'Thanks. I am starting mock infrastructure next.',
    status: 'sent',
    reactions: [{ emoji: '🚀', count: 2, userIds: ['user-sarah', 'user-mohamed'] }],
    attachments: [],
    createdAt: '2026-08-17T09:10:00.000Z'
  },
  {
    id: 'message-5',
    conversationId: 'conversation-frontend',
    senderId: 'user-sarah',
    body: 'The channel sidebar should stay compact on desktop.',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T08:30:00.000Z'
  },
  {
    id: 'message-6',
    conversationId: 'conversation-frontend',
    senderId: 'user-ahmed',
    body: 'Agreed. I will keep the shell dense and work-focused.',
    status: 'read',
    reactions: [],
    attachments: [],
    createdAt: '2026-08-17T08:45:00.000Z'
  }
]
