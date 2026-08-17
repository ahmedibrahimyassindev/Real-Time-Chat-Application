<script setup lang="ts">
import { LogOut, User } from '@lucide/vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { currentUser, clearSession } = useAuth()

function logout() {
  clearSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="grid min-h-screen grid-rows-[56px_1fr] bg-slate-950">
    <header class="flex items-center justify-between border-b border-slate-800 px-6">
      <span class="text-sm font-semibold text-white">Real-Time Chat</span>
      <div class="flex items-center gap-2">
        <RouterLink
          to="/profile"
          class="inline-flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Profile"
        >
          <User class="size-4" />
        </RouterLink>
        <button
          class="inline-flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          type="button"
          aria-label="Logout"
          @click="logout"
        >
          <LogOut class="size-4" />
        </button>
      </div>
    </header>
    <div class="grid min-h-0 grid-cols-[260px_1fr]">
      <aside class="border-r border-slate-800 bg-slate-900 p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Workspace</p>
        <p class="mt-3 truncate text-sm text-slate-200">{{ currentUser?.name }}</p>
      </aside>
      <slot />
    </div>
  </main>
</template>
