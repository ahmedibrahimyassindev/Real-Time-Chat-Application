import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useChatStore } from './chat.store'

describe('chat store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('tracks the active conversation and visible message count', () => {
    const chatStore = useChatStore()

    chatStore.selectConversation('conversation-general')
    chatStore.loadOlderMessages()

    expect(chatStore.activeConversationId).toBe('conversation-general')
    expect(chatStore.visibleMessageCounts['conversation-general']).toBe(8)
  })

  it('tracks typing users per conversation without duplicates', () => {
    const chatStore = useChatStore()

    chatStore.selectConversation('conversation-general')
    chatStore.addTypingUser('conversation-general', 'user-sarah')
    chatStore.addTypingUser('conversation-general', 'user-sarah')
    chatStore.addTypingUser('conversation-general', 'user-mohamed')

    expect(chatStore.activeTypingUserIds).toEqual(['user-sarah', 'user-mohamed'])

    chatStore.removeTypingUser('conversation-general', 'user-sarah')

    expect(chatStore.activeTypingUserIds).toEqual(['user-mohamed'])
  })
})
