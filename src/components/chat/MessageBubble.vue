<script setup lang="ts">
import { Check, CheckCheck, Paperclip, Pencil, Reply, Trash2, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import type { Message } from '@/types/message'
import type { User } from '@/types/user'
import { formatMessageTime } from '@/utils/date'

const props = defineProps<{
  message: Message
  replyToMessage?: Message
  sender?: User
  isOwnMessage: boolean
}>()

const emit = defineEmits<{
  edit: [messageId: string, body: string]
  delete: [messageId: string]
  reply: [messageId: string]
  react: [messageId: string, emoji: string]
}>()

const isEditing = ref(false)
const draftBody = ref(props.message.body)

const statusIcon = computed(() => {
  if (props.message.status === 'read') {
    return CheckCheck
  }

  return Check
})
const reactionOptions = ['👍', '❤️', '🚀']
const messageParts = computed(() =>
  props.message.body.split(/(@[a-z0-9_-]+)/gi).map((part) => ({
    text: part,
    isMention: part.startsWith('@')
  }))
)

watch(
  () => props.message.body,
  (body) => {
    draftBody.value = body
  }
)

function saveEdit() {
  emit('edit', props.message.id, draftBody.value)
  isEditing.value = false
}
</script>

<template>
  <article class="group flex gap-3" :class="{ 'justify-end': isOwnMessage }">
    <div
      v-if="!isOwnMessage"
      class="grid size-9 shrink-0 place-items-center rounded-md bg-slate-800 text-sm font-semibold text-slate-200"
    >
      {{ sender?.name.slice(0, 1) }}
    </div>

    <div class="max-w-[min(680px,80%)]">
      <div class="mb-1 flex items-center gap-2" :class="{ 'justify-end': isOwnMessage }">
        <span class="text-xs font-medium text-slate-400">{{ sender?.name }}</span>
        <time class="text-xs text-slate-500">{{ formatMessageTime(message.createdAt) }}</time>
      </div>

      <div
        class="rounded-lg border px-4 py-3 text-sm"
        :class="
          isOwnMessage
            ? 'border-cyan-400 bg-cyan-400 text-slate-950'
            : 'border-slate-800 bg-slate-900 text-slate-100'
        "
      >
        <p
          v-if="replyToMessage"
          class="mb-2 rounded-md border border-slate-700/70 bg-slate-950/40 px-2 py-1 text-xs"
          :class="isOwnMessage ? 'text-slate-700' : 'text-slate-400'"
        >
          {{ replyToMessage.body }}
        </p>
        <form v-if="isEditing" class="flex gap-2" @submit.prevent="saveEdit">
          <input
            v-model="draftBody"
            class="min-w-0 flex-1 rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-slate-950 outline-none"
            type="text"
          />
          <button class="rounded-md bg-slate-950 px-3 py-2 text-xs text-white" type="submit">
            Save
          </button>
        </form>
        <p v-else class="whitespace-pre-wrap leading-6">
          <span
            v-for="(part, index) in messageParts"
            :key="`${part.text}-${index}`"
            :class="part.isMention ? 'font-semibold text-cyan-200' : ''"
          >
            {{ part.text }}
          </span>
        </p>

        <div v-if="message.attachments.length" class="mt-3 grid gap-2">
          <div
            v-for="attachment in message.attachments"
            :key="attachment.id"
            class="flex items-center gap-2 rounded-md border border-slate-700/70 bg-slate-950/40 px-2 py-1 text-xs"
          >
            <Paperclip class="size-3.5" />
            <span class="truncate">{{ attachment.fileName }}</span>
          </div>
        </div>
      </div>

      <div class="mt-1 flex items-center gap-2" :class="{ 'justify-end': isOwnMessage }">
        <button
          v-for="emoji in reactionOptions"
          :key="emoji"
          class="rounded-md px-1.5 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
          type="button"
          @click="$emit('react', message.id, emoji)"
        >
          {{ emoji }}
          {{ message.reactions.find((reaction) => reaction.emoji === emoji)?.count || '' }}
        </button>
        <component :is="statusIcon" v-if="isOwnMessage" class="size-3.5 text-slate-500" />
        <span v-if="message.updatedAt" class="text-xs text-slate-500">edited</span>
        <button
          class="hidden rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white group-hover:inline-flex"
          type="button"
          aria-label="Reply to message"
          @click="$emit('reply', message.id)"
        >
          <Reply class="size-3.5" />
        </button>
        <button
          v-if="isOwnMessage"
          class="hidden rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white group-hover:inline-flex"
          type="button"
          aria-label="Edit message"
          @click="isEditing = !isEditing"
        >
          <X v-if="isEditing" class="size-3.5" />
          <Pencil v-else class="size-3.5" />
        </button>
        <button
          v-if="isOwnMessage"
          class="hidden rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-red-300 group-hover:inline-flex"
          type="button"
          aria-label="Delete message"
          @click="$emit('delete', message.id)"
        >
          <Trash2 class="size-3.5" />
        </button>
      </div>
    </div>
  </article>
</template>
