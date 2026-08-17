<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-slate-950 px-6">
    <section class="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900 p-6">
      <h1 class="text-2xl font-semibold text-white">{{ title }}</h1>
      <div class="mt-6">
        <slot />
      </div>
    </section>
  </main>
</template>
