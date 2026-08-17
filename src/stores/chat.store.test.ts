import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useChatStore } from './chat.store'

describe('chat store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('crypto', {
      randomUUID: () => 'message-test-id'
    })
  })

  it('sends a message into the active conversation', () => {
    const chatStore = useChatStore()

    chatStore.sendMessage('Hello team', 'user-ahmed')

    expect(chatStore.messages[chatStore.messages.length - 1]).toMatchObject({
      id: 'message-test-id',
      body: 'Hello team',
      senderId: 'user-ahmed',
      conversationId: chatStore.activeConversationId
    })
  })

  it('toggles reactions for a user', () => {
    const chatStore = useChatStore()
    const message = chatStore.messages[0]

    chatStore.toggleReaction(message.id, '👍', 'user-ahmed')
    expect(message.reactions.find((reaction) => reaction.emoji === '👍')?.count).toBe(1)

    chatStore.toggleReaction(message.id, '👍', 'user-ahmed')
    expect(message.reactions.find((reaction) => reaction.emoji === '👍')).toBeUndefined()
  })
})
