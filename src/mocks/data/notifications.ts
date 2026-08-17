import type { Notification } from '@/types/notification'

export const mockNotifications: Notification[] = [
  {
    id: 'notification-1',
    title: 'New direct message',
    body: 'Sarah Hassan replied to your conversation.',
    isRead: false,
    createdAt: '2026-08-17T09:15:00.000Z'
  },
  {
    id: 'notification-2',
    title: 'Reaction added',
    body: 'Mohamed Ali reacted to your message in #general.',
    isRead: true,
    createdAt: '2026-08-17T09:10:00.000Z'
  }
]
