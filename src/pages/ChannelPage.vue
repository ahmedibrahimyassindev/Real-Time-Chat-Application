<script setup lang="ts">
import { Hash, Lock, Plus, Save, UserMinus, UserPlus } from '@lucide/vue'
import { computed, reactive, ref } from 'vue'

import { useAuth } from '@/composables/useAuth'
import ChatLayout from '@/layouts/ChatLayout.vue'
import { mockUsers } from '@/mocks/data'
import { useChatStore } from '@/stores/chat.store'

const chatStore = useChatStore()
const { currentUser } = useAuth()
const selectedChannelId = ref(chatStore.channels[0]?.id ?? '')
const form = reactive({
  name: '',
  description: '',
  isPrivate: false
})

const selectedChannel = computed(() =>
  chatStore.channels.find((channel) => channel.id === selectedChannelId.value)
)
const isCurrentUserMember = computed(() =>
  Boolean(currentUser.value && selectedChannel.value?.memberIds.includes(currentUser.value.id))
)

function selectChannel(channelId: string) {
  const channel = chatStore.channels.find((item) => item.id === channelId)

  if (!channel) {
    return
  }

  selectedChannelId.value = channelId
  form.name = channel.name
  form.description = channel.description ?? ''
  form.isPrivate = channel.isPrivate
}

function createChannel() {
  if (!currentUser.value || !form.name.trim()) {
    return
  }

  chatStore.createChannel(form, currentUser.value.id)
  selectedChannelId.value =
    chatStore.channels[chatStore.channels.length - 1]?.id ?? selectedChannelId.value
}

function updateChannel() {
  if (!selectedChannel.value || !isCurrentUserMember.value) {
    return
  }

  chatStore.updateChannel(selectedChannel.value.id, form)
}

function toggleMembership() {
  if (!selectedChannel.value || !currentUser.value) {
    return
  }

  if (isCurrentUserMember.value) {
    chatStore.leaveChannel(selectedChannel.value.id, currentUser.value.id)
    return
  }

  chatStore.joinChannel(selectedChannel.value.id, currentUser.value.id)
}

function toggleMember(userId: string) {
  if (!selectedChannel.value || !isCurrentUserMember.value) {
    return
  }

  const memberIds = selectedChannel.value.memberIds.includes(userId)
    ? selectedChannel.value.memberIds.filter((memberId) => memberId !== userId)
    : [...selectedChannel.value.memberIds, userId]

  chatStore.setChannelMembers(selectedChannel.value.id, memberIds)
}
</script>

<template>
  <ChatLayout>
    <section class="grid min-h-0 grid-cols-[320px_1fr]">
      <aside class="min-h-0 overflow-y-auto border-r border-slate-800 bg-slate-950 p-4">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-sm font-semibold text-slate-200">Channels</h1>
        </div>

        <div class="space-y-1">
          <button
            v-for="channel in chatStore.channels"
            :key="channel.id"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm"
            :class="
              channel.id === selectedChannelId
                ? 'bg-cyan-400 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            "
            type="button"
            @click="selectChannel(channel.id)"
          >
            <Lock v-if="channel.isPrivate" class="size-4" />
            <Hash v-else class="size-4" />
            <span class="min-w-0 flex-1 truncate">#{{ channel.name }}</span>
            <span class="text-xs">{{ channel.memberIds.length }}</span>
          </button>
        </div>
      </aside>

      <div class="min-h-0 overflow-y-auto p-8">
        <div class="max-w-3xl">
          <p class="text-sm font-medium uppercase tracking-wide text-cyan-300">
            Channel management
          </p>
          <h2 class="mt-3 text-3xl font-semibold text-white">
            {{ selectedChannel ? `#${selectedChannel.name}` : 'Create channel' }}
          </h2>

          <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
            <form class="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-5">
              <label class="block">
                <span class="text-sm font-medium text-slate-300">Name</span>
                <input
                  v-model="form.name"
                  class="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                  type="text"
                />
              </label>

              <label class="block">
                <span class="text-sm font-medium text-slate-300">Description</span>
                <textarea
                  v-model="form.description"
                  class="mt-2 min-h-24 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                />
              </label>

              <label class="flex items-center gap-3 text-sm text-slate-300">
                <input v-model="form.isPrivate" type="checkbox" />
                Private channel
              </label>

              <div class="flex flex-wrap gap-3">
                <button
                  class="inline-flex items-center gap-2 rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  :disabled="!currentUser"
                  @click="createChannel"
                >
                  <Plus class="size-4" />
                  Create
                </button>

                <button
                  class="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  :disabled="!isCurrentUserMember"
                  @click="updateChannel"
                >
                  <Save class="size-4" />
                  Save
                </button>

                <button
                  class="inline-flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
                  type="button"
                  @click="toggleMembership"
                >
                  <UserMinus v-if="isCurrentUserMember" class="size-4" />
                  <UserPlus v-else class="size-4" />
                  {{ isCurrentUserMember ? 'Leave' : 'Join' }}
                </button>
              </div>
            </form>

            <section class="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <h3 class="text-sm font-semibold text-white">Members</h3>
              <div class="mt-4 space-y-2">
                <label
                  v-for="user in mockUsers"
                  :key="user.id"
                  class="flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                >
                  <span class="truncate text-slate-300">{{ user.name }}</span>
                  <input
                    type="checkbox"
                    :checked="selectedChannel?.memberIds.includes(user.id)"
                    :disabled="!isCurrentUserMember"
                    @change="toggleMember(user.id)"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  </ChatLayout>
</template>
