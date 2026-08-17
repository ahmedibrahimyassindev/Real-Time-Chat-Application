import { defineStore } from 'pinia'

import { mockConversations, mockMessages } from '@/mocks/data'
import type { MockWebSocketEvent } from '@/mocks/websocket/mockWebSocket'
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
    typingUserIdsByConversation: {} as Record<string, string[]>,
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
    },
    activeTypingUserIds: (state) =>
      state.typingUserIdsByConversation[state.activeConversationId] ?? []
  },
  actions: {
    handleRealtimeEvent(event: MockWebSocketEvent) {
      if (event.type === 'message.created') {
        this.receiveMessage(event.payload)
        return
      }

      if (event.type === 'message.updated') {
        this.editMessage(event.payload.id, event.payload.body)
        return
      }

      if (event.type === 'message.deleted') {
        this.deleteMessage(event.payload.id)
        return
      }

      if (event.type === 'message.read') {
        this.markMessageRead(event.payload.id)
        return
      }

      if (event.type === 'typing.started') {
        this.addTypingUser(event.payload.conversationId, event.payload.userId)
        return
      }

      if (event.type === 'typing.stopped') {
        this.removeTypingUser(event.payload.conversationId, event.payload.userId)
      }
    },
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
      window.setTimeout(() => {
        this.markMessageDelivered(message.id)
      }, 500)

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
    },
    receiveMessage(message: Message) {
      if (this.messages.some((item) => item.id === message.id)) {
        return
      }

      this.messages.push(message)
      this.visibleMessageCounts[message.conversationId] =
        (this.visibleMessageCounts[message.conversationId] ?? pageSize) + 1

      const conversation = this.conversations.find((item) => item.id === message.conversationId)

      if (conversation) {
        conversation.lastMessageId = message.id
        conversation.updatedAt = message.createdAt
        conversation.unreadCount =
          message.conversationId === this.activeConversationId ? 0 : conversation.unreadCount + 1
      }
    },
    markMessageDelivered(messageId: string) {
      const message = this.messages.find((item) => item.id === messageId)

      if (message?.status === 'sent') {
        message.status = 'delivered'
      }
    },
    markMessageRead(messageId: string) {
      const message = this.messages.find((item) => item.id === messageId)

      if (message) {
        message.status = 'read'
      }
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
