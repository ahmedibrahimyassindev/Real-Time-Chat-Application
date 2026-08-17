import type { QueryClient } from '@tanstack/vue-query'
import { onMounted, onUnmounted, watch, type Ref } from 'vue'

import {
  appendMessageToLatestPage,
  patchMessageInCache,
  removeMessageFromCache,
  updateConversationCache
} from '@/composables/chatCache'
import { useTyping } from '@/composables/useTyping'
import { useWebSocket } from '@/composables/useWebSocket'
import { startChatSimulation } from '@/mocks/scenarios/chatSimulation'
import { queryKeys } from '@/queries/queryKeys'
import { useChatStore } from '@/stores/chat.store'
import { usePresenceStore } from '@/stores/presence.store'
import { useWebSocketStore } from '@/stores/websocket.store'
import type { Notification } from '@/types/notification'
import type { User } from '@/types/user'

interface UseChatRealtimeOptions {
  activeConversationId: Ref<string>
  currentUser: Ref<User | null>
  queryClient: QueryClient
  readMessage: (messageId: string) => void
}

export function useChatRealtime(options: UseChatRealtimeOptions) {
  const chatStore = useChatStore()
  const presenceStore = usePresenceStore()
  const webSocketStore = useWebSocketStore()
  const { isConnected, latestEvent, connect, disconnect, unsubscribe, simulateConnectionLoss } =
    useWebSocket()
  const { stopTyping } = useTyping()
  let stopSimulation: (() => void) | undefined

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
      presenceStore.setStatus(event.payload.userId, 'offline')
      return
    }

    if (event.type === 'presence.changed') {
      presenceStore.setStatus(event.payload.userId, event.payload.status)
      return
    }

    if (event.type === 'notification.created') {
      options.queryClient.setQueryData<Notification[]>(
        queryKeys.notifications.all,
        (cached = []) => [event.payload, ...cached]
      )
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
      appendMessageToLatestPage(options.queryClient, event.payload.conversationId, event.payload)
      updateConversationCache(options.queryClient, (cached) =>
        cached.map((conversation) =>
          conversation.id === event.payload.conversationId
            ? {
                ...conversation,
                lastMessageId: event.payload.id,
                unreadCount:
                  event.payload.conversationId === options.activeConversationId.value
                    ? 0
                    : conversation.unreadCount + 1,
                updatedAt: event.payload.createdAt
              }
            : conversation
        )
      )

      if (
        event.payload.conversationId === options.activeConversationId.value &&
        event.payload.senderId !== options.currentUser.value?.id
      ) {
        window.setTimeout(() => {
          options.readMessage(event.payload.id)
        }, 900)
      }
      return
    }

    if (event.type === 'message.updated') {
      patchMessageInCache(
        options.queryClient,
        event.payload.conversationId,
        event.payload.id,
        () => event.payload
      )
      return
    }

    if (event.type === 'message.deleted') {
      removeMessageFromCache(options.queryClient, event.payload.conversationId, event.payload.id)
      return
    }

    if (event.type === 'message.read') {
      patchMessageInCache(
        options.queryClient,
        event.payload.conversationId,
        event.payload.id,
        (message) => ({ ...message, status: 'read' })
      )
    }
  })

  onMounted(() => {
    connect()
    stopSimulation = startChatSimulation({
      getConversationId: () => options.activeConversationId.value
    })
  })

  onUnmounted(() => {
    stopSimulation?.()
    stopTyping()
    disconnect()
    unsubscribe()
  })

  return {
    isConnected,
    simulateConnectionLoss
  }
}
