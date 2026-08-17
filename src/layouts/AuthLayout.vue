<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-slate-950 px-6 py-10">
    <section class="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-2xl">
      <p class="text-sm font-medium text-cyan-300">Real-Time Chat</p>
      <h1 class="mt-2 text-2xl font-semibold text-white">{{ title }}</h1>
      <div class="mt-6">
        <slot />
      </div>
    </section>
  </main>
</template>
