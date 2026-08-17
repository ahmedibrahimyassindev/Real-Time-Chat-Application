import { mockChannels } from './channels'
import { mockConversations } from './conversations'
import { mockMessages } from './messages'
import { mockNotifications } from './notifications'
import { mockUsers } from './users'

import type { Channel } from '@/types/channel'
import type { Conversation } from '@/types/conversation'
import type { Message } from '@/types/message'
import type { Notification } from '@/types/notification'
import type { User } from '@/types/user'

export interface MockDatabase {
  channels: Channel[]
  conversations: Conversation[]
  messages: Message[]
  notifications: Notification[]
  users: User[]
}

export const mockDatabase: MockDatabase = {
  channels: structuredClone(mockChannels),
  conversations: structuredClone(mockConversations),
  messages: structuredClone(mockMessages),
  notifications: structuredClone(mockNotifications),
  users: structuredClone(mockUsers)
}
