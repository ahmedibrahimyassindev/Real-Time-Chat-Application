export const queryKeys = {
  users: {
    all: ['users'] as const,
    current: ['users', 'current'] as const
  },
  conversations: {
    all: ['conversations'] as const
  },
  messages: {
    all: ['messages'] as const,
    conversation: (conversationId: string) => ['messages', conversationId] as const,
    search: (query: string) => ['messages', 'search', query] as const
  },
  channels: {
    all: ['channels'] as const
  },
  notifications: {
    all: ['notifications'] as const
  }
}
