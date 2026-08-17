<script setup lang="ts">
import { Paperclip, SendHorizonal, X } from '@lucide/vue'
import { ref } from 'vue'

import type { Attachment, Message } from '@/types/message'

defineProps<{
  replyToMessage?: Message | null
}>()

const emit = defineEmits<{
  send: [body: string, attachments: Attachment[]]
  typing: []
  cancelReply: []
}>()

const body = ref('')
const attachments = ref<Attachment[]>([])

function submitMessage() {
  const messageBody = body.value.trim()

  if (!messageBody && attachments.value.length === 0) {
    return
  }

  emit('send', messageBody, attachments.value)
  body.value = ''
  attachments.value = []
}

function addAttachments(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])

  attachments.value = files.map((file) => ({
    id: crypto.randomUUID(),
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    fileSize: file.size
  }))

  input.value = ''
}

function removeAttachment(attachmentId: string) {
  attachments.value = attachments.value.filter((attachment) => attachment.id !== attachmentId)
}
</script>

<template>
  <form class="border-t border-slate-800 bg-slate-950 p-4" @submit.prevent="submitMessage">
    <div
      v-if="replyToMessage"
      class="mb-3 flex items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
    >
      <p class="min-w-0 truncate text-xs text-slate-400">
        Replying to <span class="text-slate-200">{{ replyToMessage.body }}</span>
      </p>
      <button
        class="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        type="button"
        aria-label="Cancel reply"
        @click="$emit('cancelReply')"
      >
        <X class="size-4" />
      </button>
    </div>

    <div v-if="attachments.length" class="mb-3 flex flex-wrap gap-2">
      <span
        v-for="attachment in attachments"
        :key="attachment.id"
        class="inline-flex max-w-64 items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-300"
      >
        <span class="truncate">{{ attachment.fileName }}</span>
        <button
          class="text-slate-500 hover:text-white"
          type="button"
          aria-label="Remove attachment"
          @click="removeAttachment(attachment.id)"
        >
          <X class="size-3" />
        </button>
      </span>
    </div>

    <div class="flex items-end gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
      <label
        class="grid size-10 shrink-0 cursor-pointer place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"
        aria-label="Attach files"
      >
        <Paperclip class="size-4" />
        <input class="sr-only" type="file" multiple @change="addAttachments" />
      </label>
      <textarea
        v-model="body"
        class="max-h-36 min-h-11 flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-500"
        placeholder="Message"
        rows="1"
        @input="$emit('typing')"
        @keydown.enter.exact.prevent="submitMessage"
      />
      <button
        class="grid size-10 shrink-0 place-items-center rounded-md bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        :disabled="!body.trim() && attachments.length === 0"
        aria-label="Send message"
      >
        <SendHorizonal class="size-4" />
      </button>
    </div>
  </form>
</template>
