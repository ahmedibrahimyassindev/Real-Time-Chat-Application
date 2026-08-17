<script setup lang="ts">
import { Bell, Hash, LogOut, Search, User } from '@lucide/vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'
import { useNotificationStore } from '@/stores/notification.store'

const router = useRouter()
const { currentUser, clearSession } = useAuth()
const notificationStore = useNotificationStore()

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
          to="/notifications"
          class="relative inline-flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell class="size-4" />
          <span
            v-if="notificationStore.unreadCount"
            class="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-slate-950"
          >
            {{ notificationStore.unreadCount }}
          </span>
        </RouterLink>
        <RouterLink
          to="/channels"
          class="inline-flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Channels"
        >
          <Hash class="size-4" />
        </RouterLink>
        <RouterLink
          to="/search"
          class="inline-flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          aria-label="Search"
        >
          <Search class="size-4" />
        </RouterLink>
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
    <div class="grid min-h-0 grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside class="hidden border-r border-slate-800 bg-slate-900 p-4 lg:block">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Workspace</p>
        <p class="mt-3 truncate text-sm text-slate-200">{{ currentUser?.name }}</p>
      </aside>
      <slot />
    </div>
  </main>
</template>
