import { defineStore } from 'pinia'

const pageSize = 4

export const useChatStore = defineStore('chat', {
  state: () => ({
    activeConversationId: '',
    replyToMessageId: null as string | null,
    typingUserIdsByConversation: {} as Record<string, string[]>,
    visibleMessageCounts: {} as Record<string, number>
  }),
  getters: {
    activeTypingUserIds: (state) =>
      state.typingUserIdsByConversation[state.activeConversationId] ?? []
  },
  actions: {
    selectConversation(conversationId: string) {
      this.activeConversationId = conversationId
      this.ensureConversation(conversationId)
    },
    ensureConversation(conversationId: string) {
      if (!this.visibleMessageCounts[conversationId]) {
        this.visibleMessageCounts[conversationId] = pageSize
      }
    },
    loadOlderMessages() {
      if (!this.activeConversationId) {
        return
      }

      const currentCount = this.visibleMessageCounts[this.activeConversationId] ?? pageSize
      this.visibleMessageCounts[this.activeConversationId] = currentCount + pageSize
    },
    setReplyTarget(messageId: string | null) {
      this.replyToMessageId = messageId
    },
    addTypingUser(conversationId: string, userId: string) {
      const typingUserIds = this.typingUserIdsByConversation[conversationId] ?? []

      if (!typingUserIds.includes(userId)) {
        this.typingUserIdsByConversation[conversationId] = [...typingUserIds, userId]
      }
    },
    removeTypingUser(conversationId: string, userId: string) {
      const typingUserIds = this.typingUserIdsByConversation[conversationId] ?? []
      this.typingUserIdsByConversation[conversationId] = typingUserIds.filter(
        (typingUserId) => typingUserId !== userId
      )
    }
  }
})
