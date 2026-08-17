<script setup lang="ts">
import { Wifi, WifiOff } from '@lucide/vue'

import ConversationList from '@/components/chat/ConversationList.vue'
import MessageComposer from '@/components/chat/MessageComposer.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useChat } from '@/composables/useChat'
import ChatLayout from '@/layouts/ChatLayout.vue'

const {
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
} = useChat()
</script>

<template>
  <ChatLayout>
    <section
      class="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] xl:grid-cols-[280px_1fr] xl:grid-rows-1"
    >
      <aside
        class="max-h-48 overflow-y-auto border-b border-slate-800 bg-slate-950 p-4 xl:max-h-none xl:border-b-0 xl:border-r"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-slate-200">Conversations</h2>
        </div>
        <ConversationList
          :conversations="conversations"
          :active-conversation-id="activeConversationId"
          @select="selectConversation"
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
          :messages="activeMessages"
          :all-messages="allMessages"
          :users="users"
          :current-user-id="currentUser?.id ?? ''"
          :has-older-messages="hasOlderMessages"
          @load-older="chatStore.loadOlderMessages"
          @edit="editMessage"
          @delete="deleteActiveMessage"
          @reply="chatStore.setReplyTarget"
          @react="reactToMessage"
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
