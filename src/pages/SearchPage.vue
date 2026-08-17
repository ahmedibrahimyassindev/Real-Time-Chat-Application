<script setup lang="ts">
import { Search } from '@lucide/vue'
import { computed, ref } from 'vue'

import { useAuth } from '@/composables/useAuth'
import ChatLayout from '@/layouts/ChatLayout.vue'
import { mockConversations, mockUsers } from '@/mocks/data'
import { useChatStore } from '@/stores/chat.store'
import { formatMessageTime } from '@/utils/date'

const chatStore = useChatStore()
const { currentUser } = useAuth()
const query = ref('')
const results = computed(() => chatStore.searchMessages(query.value))

function senderName(senderId: string) {
  return mockUsers.find((user) => user.id === senderId)?.name ?? 'Unknown user'
}

function conversationTitle(conversationId: string) {
  return mockConversations.find((conversation) => conversation.id === conversationId)?.title
}
</script>

<template>
  <ChatLayout>
    <section class="min-h-0 overflow-y-auto p-8">
      <div class="max-w-3xl">
        <p class="text-sm font-medium uppercase tracking-wide text-cyan-300">Search</p>
        <h1 class="mt-3 text-3xl font-semibold text-white">Messages</h1>

        <label
          class="mt-8 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
        >
          <Search class="size-4 text-slate-500" />
          <input
            v-model="query"
            class="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            type="search"
            placeholder="Search messages"
          />
        </label>

        <div class="mt-6 space-y-3">
          <article
            v-for="message in results"
            :key="message.id"
            class="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <div class="flex items-center justify-between gap-4">
              <p class="text-sm font-medium text-white">{{ senderName(message.senderId) }}</p>
              <time class="text-xs text-slate-500">{{ formatMessageTime(message.createdAt) }}</time>
            </div>
            <p class="mt-1 text-xs text-cyan-300">
              {{ conversationTitle(message.conversationId) }}
            </p>
            <p class="mt-3 text-sm leading-6 text-slate-300">{{ message.body }}</p>
          </article>

          <p v-if="query && results.length === 0" class="text-sm text-slate-500">
            No matching messages.
          </p>
          <p v-if="!query" class="text-sm text-slate-500">
            Search across {{ currentUser?.name ? 'your' : 'mock' }} conversations.
          </p>
        </div>
      </div>
    </section>
  </ChatLayout>
</template>
