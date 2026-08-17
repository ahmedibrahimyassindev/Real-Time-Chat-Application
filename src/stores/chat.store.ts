import { defineStore } from 'pinia'

import { mockConversations, mockMessages } from '@/mocks/data'
import type { Conversation } from '@/types/conversation'
import type { Message } from '@/types/message'

const pageSize = 4

function sortMessages(messages: Message[]) {
  return [...messages].sort(
    (first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  )
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [...mockConversations] as Conversation[],
    messages: [...mockMessages] as Message[],
    activeConversationId: mockConversations[0]?.id ?? '',
    visibleMessageCounts: Object.fromEntries(
      mockConversations.map((conversation) => [conversation.id, pageSize])
    ) as Record<string, number>
  }),
  getters: {
    activeConversation: (state) =>
      state.conversations.find((conversation) => conversation.id === state.activeConversationId) ??
      null,
    activeMessages: (state) => {
      const conversationMessages = sortMessages(
        state.messages.filter((message) => message.conversationId === state.activeConversationId)
      )
      const visibleCount = state.visibleMessageCounts[state.activeConversationId] ?? pageSize

      return conversationMessages.slice(Math.max(conversationMessages.length - visibleCount, 0))
    },
    hasOlderMessages: (state) => {
      const total = state.messages.filter(
        (message) => message.conversationId === state.activeConversationId
      ).length
      const visibleCount = state.visibleMessageCounts[state.activeConversationId] ?? pageSize

      return visibleCount < total
    }
  },
  actions: {
    selectConversation(conversationId: string) {
      this.activeConversationId = conversationId
      const conversation = this.conversations.find((item) => item.id === conversationId)

      if (conversation) {
        conversation.unreadCount = 0
      }
    },
    loadOlderMessages() {
      const currentCount = this.visibleMessageCounts[this.activeConversationId] ?? pageSize
      this.visibleMessageCounts[this.activeConversationId] = currentCount + pageSize
    },
    sendMessage(body: string, senderId: string) {
      const trimmedBody = body.trim()

      if (!trimmedBody || !this.activeConversationId) {
        return
      }

      const now = new Date().toISOString()
      const message: Message = {
        id: crypto.randomUUID(),
        conversationId: this.activeConversationId,
        senderId,
        body: trimmedBody,
        status: 'sent',
        reactions: [],
        attachments: [],
        createdAt: now
      }

      this.messages.push(message)
      this.visibleMessageCounts[this.activeConversationId] =
        (this.visibleMessageCounts[this.activeConversationId] ?? pageSize) + 1

      const conversation = this.conversations.find((item) => item.id === this.activeConversationId)

      if (conversation) {
        conversation.lastMessageId = message.id
        conversation.updatedAt = now
      }
    },
    editMessage(messageId: string, body: string) {
      const message = this.messages.find((item) => item.id === messageId)

      if (!message || !body.trim()) {
        return
      }

      message.body = body.trim()
      message.updatedAt = new Date().toISOString()
    },
    deleteMessage(messageId: string) {
      this.messages = this.messages.filter((message) => message.id !== messageId)
    }
  }
})
