<script setup lang="ts">
import { computed } from 'vue'

import ConversationList from '@/components/chat/ConversationList.vue'
import MessageComposer from '@/components/chat/MessageComposer.vue'
import MessageList from '@/components/chat/MessageList.vue'
import { useAuth } from '@/composables/useAuth'
import ChatLayout from '@/layouts/ChatLayout.vue'
import { mockUsers } from '@/mocks/data'
import { useChatStore } from '@/stores/chat.store'

const chatStore = useChatStore()
const { currentUser } = useAuth()

const activeConversation = computed(() => chatStore.activeConversation)

function sendMessage(body: string) {
  if (!currentUser.value) {
    return
  }

  chatStore.sendMessage(body, currentUser.value.id)
}
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

      <div class="grid min-h-0 grid-rows-[64px_1fr_auto]">
        <header class="flex items-center border-b border-slate-800 px-6">
          <div>
            <h1 class="text-base font-semibold text-white">{{ activeConversation?.title }}</h1>
            <p class="mt-1 text-xs text-slate-500">
              {{ activeConversation?.memberIds.length ?? 0 }} members
            </p>
          </div>
        </header>

        <MessageList
          :messages="chatStore.activeMessages"
          :users="mockUsers"
          :current-user-id="currentUser?.id ?? ''"
          :has-older-messages="chatStore.hasOlderMessages"
          @load-older="chatStore.loadOlderMessages"
          @edit="chatStore.editMessage"
          @delete="chatStore.deleteMessage"
        />

        <MessageComposer @send="sendMessage" />
      </div>
    </section>
  </ChatLayout>
</template>
