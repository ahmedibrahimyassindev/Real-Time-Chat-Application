<script setup lang="ts">
import MessageBubble from './MessageBubble.vue'

import type { Message } from '@/types/message'
import type { User } from '@/types/user'

defineProps<{
  messages: Message[]
  users: User[]
  currentUserId: string
  hasOlderMessages: boolean
}>()

defineEmits<{
  loadOlder: []
  edit: [messageId: string, body: string]
  delete: [messageId: string]
}>()

function findSender(users: User[], senderId: string) {
  return users.find((user) => user.id === senderId)
}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-5">
    <button
      v-if="hasOlderMessages"
      class="mx-auto mb-6 rounded-md border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
      type="button"
      @click="$emit('loadOlder')"
    >
      Load older messages
    </button>

    <div v-if="messages.length" class="space-y-5">
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :sender="findSender(users, message.senderId)"
        :is-own-message="message.senderId === currentUserId"
        @edit="(messageId, body) => $emit('edit', messageId, body)"
        @delete="(messageId) => $emit('delete', messageId)"
      />
    </div>

    <div v-else class="grid flex-1 place-items-center text-sm text-slate-500">
      No messages in this conversation.
    </div>
  </section>
</template>
