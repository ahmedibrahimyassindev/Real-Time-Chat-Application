import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, onMounted, onUnmounted, watch } from 'vue'

import {
  createMessage,
  deleteMessage,
  markMessageRead,
  toggleMessageReaction,
  updateMessage
} from '@/api/messages.api'
import { useAuth } from '@/composables/useAuth'
import { useTyping } from '@/composables/useTyping'
import { useWebSocket } from '@/composables/useWebSocket'
import { startChatSimulation } from '@/mocks/scenarios/chatSimulation'
import { queryKeys } from '@/queries/queryKeys'
import { useConversationsQuery } from '@/queries/useConversationsQuery'
import { useMessagesQuery } from '@/queries/useMessagesQuery'
import { useUsersQuery } from '@/queries/useUsersQuery'
import { useChatStore } from '@/stores/chat.store'
import { usePresenceStore } from '@/stores/presence.store'
import { useWebSocketStore } from '@/stores/websocket.store'
import type { Conversation } from '@/types/conversation'
import type { Attachment, Message } from '@/types/message'
import type { Notification } from '@/types/notification'
import type { UserStatus } from '@/types/user'

export function useChat() {
  const chatStore = useChatStore()
  const presenceStore = usePresenceStore()
  const webSocketStore = useWebSocketStore()
  const queryClient = useQueryClient()
  const { currentUser } = useAuth()
  const { isConnected, latestEvent, connect, disconnect, unsubscribe, simulateConnectionLoss } =
    useWebSocket()
  const { notifyTyping, stopTyping } = useTyping()

  const conversationsQuery = useConversationsQuery()
  const usersQuery = useUsersQuery()
  const conversations = computed(() => conversationsQuery.data.value ?? [])
  const users = computed(() => usersQuery.data.value ?? [])
  const activeConversationId = computed(() => chatStore.activeConversationId)
  const messagesQuery = useMessagesQuery(activeConversationId)
  const allMessages = computed(() => messagesQuery.data.value ?? [])
  const activeConversation = computed(
    () =>
      conversations.value.find((conversation) => conversation.id === activeConversationId.value) ??
      null
  )
  const replyToMessage = computed(() =>
    allMessages.value.find((message) => message.id === chatStore.replyToMessageId)
  )
  const visibleCount = computed(
    () => chatStore.visibleMessageCounts[activeConversationId.value] ?? 4
  )
  const activeMessages = computed(() =>
    [...allMessages.value]
      .sort(
        (first, second) =>
          new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
      )
      .slice(Math.max(allMessages.value.length - visibleCount.value, 0))
  )
  const hasOlderMessages = computed(() => visibleCount.value < allMessages.value.length)
  const activeTypingNames = computed(() =>
    chatStore.activeTypingUserIds
      .filter((userId) => userId !== currentUser.value?.id)
      .map((userId) => users.value.find((user) => user.id === userId)?.name)
      .filter(Boolean)
  )
  const onlineMembersCount = computed(
    () =>
      activeConversation.value?.memberIds.filter(
        (memberId) => presenceStore.statuses[memberId] === 'online'
      ).length ?? 0
  )

  let stopSimulation: (() => void) | undefined

  function updateConversationCache(updater: (conversations: Conversation[]) => Conversation[]) {
    queryClient.setQueryData<Conversation[]>(queryKeys.conversations.all, (cached = []) =>
      updater(cached)
    )
  }

  function updateMessageCache(conversationId: string, updater: (messages: Message[]) => Message[]) {
    queryClient.setQueryData<Message[]>(
      queryKeys.messages.conversation(conversationId),
      (cached = []) => updater(cached)
    )
  }

  function selectConversation(conversationId: string) {
    chatStore.selectConversation(conversationId)
    updateConversationCache((cached) =>
      cached.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )
    )
  }

  const sendMessageMutation = useMutation({
    mutationFn: (input: { body: string; attachments: Attachment[] }) =>
      createMessage(activeConversationId.value, {
        senderId: currentUser.value?.id ?? '',
        body: input.body,
        replyToMessageId: chatStore.replyToMessageId ?? undefined,
        attachments: input.attachments
      }),
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
    onMutate: async (input) => {
      const conversationId = activeConversationId.value
      await queryClient.cancelQueries({ queryKey: queryKeys.messages.conversation(conversationId) })

      const previousMessages =
        queryClient.getQueryData<Message[]>(queryKeys.messages.conversation(conversationId)) ?? []
      const tempMessage: Message = {
        id: `optimistic-${crypto.randomUUID()}`,
        conversationId,
        senderId: currentUser.value?.id ?? '',
        body: input.body.trim(),
        replyToMessageId: chatStore.replyToMessageId ?? undefined,
        status: 'sent',
        reactions: [],
        attachments: input.attachments,
        createdAt: new Date().toISOString()
      }

      updateMessageCache(conversationId, (cached) => [...cached, tempMessage])
      chatStore.setReplyTarget(null)
      chatStore.visibleMessageCounts[conversationId] = visibleCount.value + 1

      return { conversationId, previousMessages, tempMessage }
    },
    onError: (_error, _input, context) => {
      if (context) {
        queryClient.setQueryData(
          queryKeys.messages.conversation(context.conversationId),
          context.previousMessages
        )
      }
    },
    onSuccess: (savedMessage, _input, context) => {
      updateMessageCache(savedMessage.conversationId, (cached) =>
        cached.map((message) => (message.id === context?.tempMessage.id ? savedMessage : message))
      )
    },
    onSettled: (_data, _error, _input, context) => {
      if (context) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.messages.conversation(context.conversationId)
        })
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.all })
    }
  })

  const editMessageMutation = useMutation({
    mutationFn: (input: { messageId: string; body: string }) =>
      updateMessage(input.messageId, input.body),
    onSuccess: (message) => {
      updateMessageCache(message.conversationId, (cached) =>
        cached.map((item) => (item.id === message.id ? message : item))
      )
    }
  })

  const deleteMessageMutation = useMutation({
    mutationFn: deleteMessage,
    onMutate: (messageId) => {
      updateMessageCache(activeConversationId.value, (cached) =>
        cached.filter((message) => message.id !== messageId)
      )
    }
  })

  const reactMessageMutation = useMutation({
    mutationFn: (input: { messageId: string; emoji: string; userId: string }) =>
      toggleMessageReaction(input.messageId, input.emoji, input.userId),
    onSuccess: (message) => {
      updateMessageCache(message.conversationId, (cached) =>
        cached.map((item) => (item.id === message.id ? message : item))
      )
    }
  })

  const readMessageMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: (message) => {
      updateMessageCache(message.conversationId, (cached) =>
        cached.map((item) => (item.id === message.id ? message : item))
      )
    }
  })

  function sendMessage(body: string, attachments: Attachment[]) {
    if (!currentUser.value || !activeConversationId.value) {
      return
    }

    sendMessageMutation.mutate({ body, attachments })
  }

  function editMessage(messageId: string, body: string) {
    editMessageMutation.mutate({ messageId, body })
  }

  function deleteActiveMessage(messageId: string) {
    deleteMessageMutation.mutate(messageId)
  }

  function reactToMessage(messageId: string, emoji: string) {
    if (!currentUser.value) {
      return
    }

    reactMessageMutation.mutate({ messageId, emoji, userId: currentUser.value.id })
  }

  function handleTyping() {
    if (!currentUser.value || !activeConversationId.value) {
      return
    }

    notifyTyping(activeConversationId.value, currentUser.value.id)
  }

  watch(
    conversations,
    (items) => {
      if (!chatStore.activeConversationId && items[0]) {
        selectConversation(items[0].id)
      }
    },
    { immediate: true }
  )

  watch(
    users,
    (items) => {
      const statuses = Object.fromEntries(items.map((user) => [user.id, user.status])) as Record<
        string,
        UserStatus
      >

      presenceStore.setStatuses(statuses)
    },
    { immediate: true }
  )

  watch(latestEvent, (event) => {
    if (!event) {
      return
    }

    webSocketStore.setConnected(isConnected.value)

    if (event.type === 'user.online') {
      presenceStore.setStatus(event.payload.userId, 'online')
      return
    }

    if (event.type === 'user.offline') {
      webSocketStore.recordReconnectAttempt()
      presenceStore.setStatus(event.payload.userId, 'offline')
      return
    }

    if (event.type === 'presence.changed') {
      presenceStore.setStatus(event.payload.userId, event.payload.status)
      return
    }

    if (event.type === 'notification.created') {
      queryClient.setQueryData<Notification[]>(queryKeys.notifications.all, (cached = []) => [
        event.payload,
        ...cached
      ])
      return
    }

    if (event.type === 'typing.started') {
      chatStore.addTypingUser(event.payload.conversationId, event.payload.userId)
      return
    }

    if (event.type === 'typing.stopped') {
      chatStore.removeTypingUser(event.payload.conversationId, event.payload.userId)
      return
    }

    if (event.type === 'message.created') {
      updateMessageCache(event.payload.conversationId, (cached) =>
        cached.some((message) => message.id === event.payload.id)
          ? cached
          : [...cached, event.payload]
      )
      updateConversationCache((cached) =>
        cached.map((conversation) =>
          conversation.id === event.payload.conversationId
            ? {
                ...conversation,
                lastMessageId: event.payload.id,
                unreadCount:
                  event.payload.conversationId === activeConversationId.value
                    ? 0
                    : conversation.unreadCount + 1,
                updatedAt: event.payload.createdAt
              }
            : conversation
        )
      )

      if (
        event.payload.conversationId === activeConversationId.value &&
        event.payload.senderId !== currentUser.value?.id
      ) {
        window.setTimeout(() => {
          readMessageMutation.mutate(event.payload.id)
        }, 900)
      }
      return
    }

    if (event.type === 'message.updated') {
      updateMessageCache(event.payload.conversationId, (cached) =>
        cached.map((message) => (message.id === event.payload.id ? event.payload : message))
      )
      return
    }

    if (event.type === 'message.deleted') {
      updateMessageCache(event.payload.conversationId, (cached) =>
        cached.filter((message) => message.id !== event.payload.id)
      )
      return
    }

    if (event.type === 'message.read') {
      updateMessageCache(event.payload.conversationId, (cached) =>
        cached.map((message) =>
          message.id === event.payload.id ? { ...message, status: 'read' } : message
        )
      )
    }
  })

  onMounted(() => {
    connect()
    stopSimulation = startChatSimulation({
      getConversationId: () => activeConversationId.value
    })
  })

  onUnmounted(() => {
    stopSimulation?.()
    stopTyping()
    disconnect()
    unsubscribe()
  })

  return {
    activeConversation,
    activeConversationId,
    activeMessages,
    activeTypingNames,
    allMessages,
    chatStore,
    conversations,
    currentUser,
    deleteActiveMessage,
    editMessage,
    handleTyping,
    hasOlderMessages,
    isConnected,
    onlineMembersCount,
    reactToMessage,
    replyToMessage,
    selectConversation,
    sendMessage,
    simulateConnectionLoss,
    users
  }
}
