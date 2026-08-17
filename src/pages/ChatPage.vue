<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
</script>

<template>
  <ChatLayout>
    <section class="flex h-full flex-col justify-center px-8">
      <p class="text-sm font-medium uppercase tracking-wide text-cyan-300">Phase 1</p>
      <h1 class="mt-3 text-3xl font-semibold text-white">Chat foundation is ready</h1>
      <p class="mt-4 max-w-xl text-slate-300">
        Routing, state management, API utilities, validation, and styling are configured. Mock chat
        infrastructure comes next.
      </p>
    </section>
  </ChatLayout>
</template>
