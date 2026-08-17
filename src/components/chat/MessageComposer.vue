<script setup lang="ts">
import { SendHorizonal } from '@lucide/vue'
import { ref } from 'vue'

const emit = defineEmits<{
  send: [body: string]
}>()

const body = ref('')

function submitMessage() {
  const messageBody = body.value.trim()

  if (!messageBody) {
    return
  }

  emit('send', messageBody)
  body.value = ''
}
</script>

<template>
  <form class="border-t border-slate-800 bg-slate-950 p-4" @submit.prevent="submitMessage">
    <div class="flex items-end gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
      <textarea
        v-model="body"
        class="max-h-36 min-h-11 flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-500"
        placeholder="Message"
        rows="1"
        @keydown.enter.exact.prevent="submitMessage"
      />
      <button
        class="grid size-10 shrink-0 place-items-center rounded-md bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        :disabled="!body.trim()"
        aria-label="Send message"
      >
        <SendHorizonal class="size-4" />
      </button>
    </div>
  </form>
</template>
