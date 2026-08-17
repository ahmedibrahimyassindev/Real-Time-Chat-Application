<script setup lang="ts">
import { Wifi, WifiOff } from '@lucide/vue'
import { computed, onMounted, onUnmounted, watch } from 'vue'

import ConversationList from '@/components/chat/ConversationList.vue'
import MessageComposer from '@/components/chat/MessageComposer.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useAuth } from '@/composables/useAuth'
import { useTyping } from '@/composables/useTyping'
import { useWebSocket } from '@/composables/useWebSocket'
import ChatLayout from '@/layouts/ChatLayout.vue'
import { mockWebSocketClient } from '@/mocks/websocket/mockWebSocket'
import { mockUsers } from '@/mocks/data'
import { useChatStore } from '@/stores/chat.store'
import { usePresenceStore } from '@/stores/presence.store'
import { useWebSocketStore } from '@/stores/websocket.store'
import type { Attachment, Message } from '@/types/message'

const chatStore = useChatStore()
const presenceStore = usePresenceStore()
const webSocketStore = useWebSocketStore()
const { currentUser } = useAuth()
const { isConnected, latestEvent, connect, disconnect, simulateConnectionLoss } = useWebSocket()
const { notifyTyping, stopTyping } = useTyping()

const activeConversation = computed(() => chatStore.activeConversation)
const replyToMessage = computed(() =>
  chatStore.messages.find((message) => message.id === chatStore.replyToMessageId)
)
const activeTypingNames = computed(() =>
  chatStore.activeTypingUserIds
    .filter((userId) => userId !== currentUser.value?.id)
    .map((userId) => mockUsers.find((user) => user.id === userId)?.name)
    .filter(Boolean)
)
const onlineMembersCount = computed(
  () =>
    activeConversation.value?.memberIds.filter(
      (memberId) => presenceStore.statuses[memberId] === 'online'
    ).length ?? 0
)

let simulationTimer: number | undefined

function createIncomingMessage(conversationId: string): Message {
  const senderId = conversationId === 'conversation-sarah' ? 'user-sarah' : 'user-mohamed'

  return {
    id: crypto.randomUUID(),
    conversationId,
    senderId,
    body:
      conversationId === 'conversation-sarah'
        ? 'I just reviewed the latest change.'
        : 'Real-time mock event received for this conversation.',
    status: 'delivered',
    reactions: [],
    attachments: [],
    createdAt: new Date().toISOString()
  }
}

function simulateIncomingActivity() {
  const conversationId = chatStore.activeConversationId
  const senderId = conversationId === 'conversation-sarah' ? 'user-sarah' : 'user-mohamed'

  mockWebSocketClient.emit({
    type: 'typing.started',
    payload: { conversationId, userId: senderId }
  })

  window.setTimeout(() => {
    mockWebSocketClient.emit({
      type: 'typing.stopped',
      payload: { conversationId, userId: senderId }
    })
    mockWebSocketClient.emit({
      type: 'message.created',
      payload: createIncomingMessage(conversationId)
    })
  }, 1600)
}

function sendMessage(body: string, attachments: Attachment[]) {
  if (!currentUser.value) {
    return
  }

  chatStore.sendMessage(body, currentUser.value.id, attachments)
}

function handleTyping() {
  if (!currentUser.value) {
    return
  }

  notifyTyping(chatStore.activeConversationId, currentUser.value.id)
}

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

  chatStore.handleRealtimeEvent(event)

  if (
    event.type === 'message.created' &&
    event.payload.conversationId === chatStore.activeConversationId &&
    event.payload.senderId !== currentUser.value?.id
  ) {
    window.setTimeout(() => {
      mockWebSocketClient.emit({
        type: 'message.read',
        payload: {
          id: event.payload.id,
          conversationId: event.payload.conversationId,
          userId: currentUser.value?.id ?? ''
        }
      })
    }, 900)
  }
})

onMounted(() => {
  connect()
  simulationTimer = window.setInterval(simulateIncomingActivity, 14000)
})

onUnmounted(() => {
  window.clearInterval(simulationTimer)
  stopTyping()
  disconnect()
})
</script>

<template>
  <ChatLayout>
    <section class="grid min-h-0 grid-cols-[280px_1fr]">
      <aside class="min-h-0 border-r border-slate-800 bg-slate-950 p-4">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-200">Conversations</h2>
        </div>
        <ConversationList
          :conversations="chatStore.conversations"
          :active-conversation-id="chatStore.activeConversationId"
          @select="chatStore.selectConversation"
        />
      </aside>

      <div class="grid min-h-0 grid-rows-[64px_1fr_28px_auto]">
        <header class="flex items-center justify-between border-b border-slate-800 px-6">
          <div>
            <h1 class="text-base font-semibold text-white">{{ activeConversation?.title }}</h1>
            <p class="mt-1 text-xs text-slate-500">
              {{ onlineMembersCount }} online of {{ activeConversation?.memberIds.length ?? 0 }}
              members
            </p>
          </div>

          <button
            class="inline-flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
            type="button"
            @click="simulateConnectionLoss"
          >
            <Wifi v-if="isConnected" class="size-4 text-emerald-300" />
            <WifiOff v-else class="size-4 text-red-300" />
            <span>{{ isConnected ? 'Connected' : 'Reconnecting' }}</span>
          </button>
        </header>

        <MessageList
          :messages="chatStore.activeMessages"
          :all-messages="chatStore.messages"
          :users="mockUsers"
          :current-user-id="currentUser?.id ?? ''"
          :has-older-messages="chatStore.hasOlderMessages"
          @load-older="chatStore.loadOlderMessages"
          @edit="chatStore.editMessage"
          @delete="chatStore.deleteMessage"
          @reply="chatStore.setReplyTarget"
          @react="
            (messageId, emoji) =>
              currentUser && chatStore.toggleReaction(messageId, emoji, currentUser.id)
          "
        />

        <div class="h-7 px-6 text-xs text-slate-500">
          <span v-if="activeTypingNames.length">
            {{ activeTypingNames.join(' and ') }}
            {{ activeTypingNames.length === 1 ? 'is' : 'are' }}
            typing...
          </span>
        </div>

        <MessageComposer
          :reply-to-message="replyToMessage"
          @send="sendMessage"
          @typing="handleTyping"
          @cancel-reply="chatStore.setReplyTarget(null)"
        />
      </div>
    </section>
  </ChatLayout>
</template>
