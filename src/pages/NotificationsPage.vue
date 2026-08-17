<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { Bell, CheckCheck } from '@lucide/vue'
import { computed } from 'vue'

import { markAllNotificationsRead, markNotificationRead } from '@/api/notifications.api'
import ChatLayout from '@/layouts/ChatLayout.vue'
import { queryKeys } from '@/queries/queryKeys'
import { useNotificationsQuery } from '@/queries/useNotificationsQuery'
import { formatMessageTime } from '@/utils/date'

const queryClient = useQueryClient()
const notificationsQuery = useNotificationsQuery()
const notifications = computed(() => notificationsQuery.data.value ?? [])

const markReadMutation = useMutation({
  mutationFn: markNotificationRead,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
  }
})

const markAllReadMutation = useMutation({
  mutationFn: markAllNotificationsRead,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
  }
})
</script>

<template>
  <ChatLayout>
    <section class="min-h-0 overflow-y-auto p-8">
      <div class="max-w-3xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-medium uppercase tracking-wide text-cyan-300">Notifications</p>
            <h1 class="mt-3 text-3xl font-semibold text-white">Notification center</h1>
          </div>

          <button
            class="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            type="button"
            @click="markAllReadMutation.mutate()"
          >
            <CheckCheck class="size-4" />
            Mark all read
          </button>
        </div>

        <div class="mt-8 space-y-3">
          <article
            v-for="notification in notifications"
            :key="notification.id"
            class="flex gap-4 rounded-lg border p-4"
            :class="
              notification.isRead ? 'border-slate-800 bg-slate-900' : 'border-cyan-400 bg-slate-900'
            "
          >
            <div
              class="grid size-10 shrink-0 place-items-center rounded-md bg-slate-950 text-cyan-300"
            >
              <Bell class="size-4" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-sm font-semibold text-white">{{ notification.title }}</h2>
                  <p class="mt-1 text-sm leading-6 text-slate-300">{{ notification.body }}</p>
                </div>
                <time class="shrink-0 text-xs text-slate-500">
                  {{ formatMessageTime(notification.createdAt) }}
                </time>
              </div>

              <button
                v-if="!notification.isRead"
                class="mt-3 text-xs font-medium text-cyan-300 hover:text-cyan-200"
                type="button"
                @click="markReadMutation.mutate(notification.id)"
              >
                Mark as read
              </button>
            </div>
          </article>

          <p
            v-if="notifications.length === 0"
            class="rounded-lg border border-slate-800 bg-slate-900 p-6 text-sm text-slate-500"
          >
            No notifications.
          </p>
        </div>
      </div>
    </section>
  </ChatLayout>
</template>
