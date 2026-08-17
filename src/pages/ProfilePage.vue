<script setup lang="ts">
import { Mail, UserRound } from '@lucide/vue'

import { useAuth } from '@/composables/useAuth'
import ChatLayout from '@/layouts/ChatLayout.vue'

const { currentUser } = useAuth()
</script>

<template>
  <ChatLayout>
    <section class="p-8">
      <div class="max-w-2xl">
        <p class="text-sm font-medium uppercase tracking-wide text-cyan-300">Profile</p>
        <h1 class="mt-3 text-3xl font-semibold text-white">Account details</h1>

        <div class="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <div class="flex items-center gap-4">
            <div class="grid size-14 place-items-center rounded-md bg-slate-800 text-cyan-300">
              <UserRound class="size-7" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-white">{{ currentUser?.name }}</h2>
              <p class="text-sm capitalize text-slate-400">{{ currentUser?.status }}</p>
            </div>
          </div>

          <dl class="mt-6 grid gap-4">
            <div
              class="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-950 p-4"
            >
              <Mail class="size-4 text-slate-400" />
              <div>
                <dt class="text-xs uppercase tracking-wide text-slate-500">Email</dt>
                <dd class="mt-1 text-sm text-slate-200">{{ currentUser?.email }}</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </section>
  </ChatLayout>
</template>
