<script setup lang="ts">
import { Hash, MessageSquare } from '@lucide/vue'

import type { Conversation } from '@/types/conversation'

defineProps<{
  conversations: Conversation[]
  activeConversationId: string
}>()

defineEmits<{
  select: [conversationId: string]
}>()
</script>

<template>
  <nav class="space-y-1">
    <button
      v-for="conversation in conversations"
      :key="conversation.id"
      class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition"
      :class="
        conversation.id === activeConversationId
          ? 'bg-cyan-400 text-slate-950'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      "
      type="button"
      @click="$emit('select', conversation.id)"
    >
      <Hash v-if="conversation.type === 'channel'" class="size-4 shrink-0" />
      <MessageSquare v-else class="size-4 shrink-0" />
      <span class="min-w-0 flex-1 truncate">{{ conversation.title }}</span>
      <span
        v-if="conversation.unreadCount"
        class="grid min-w-5 place-items-center rounded-full bg-slate-950 px-1.5 text-xs font-semibold text-cyan-300"
      >
        {{ conversation.unreadCount }}
      </span>
    </button>
  </nav>
</template>
