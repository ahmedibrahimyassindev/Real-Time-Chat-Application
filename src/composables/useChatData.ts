import type { QueryClient } from '@tanstack/vue-query'
import { computed, watch } from 'vue'

import { updateConversationCache } from '@/composables/chatCache'
import { useConversationsQuery } from '@/queries/useConversationsQuery'
import { useUsersQuery } from '@/queries/useUsersQuery'
import { useChatStore } from '@/stores/chat.store'
import { usePresenceStore } from '@/stores/presence.store'
import type { UserStatus } from '@/types/user'

export function useChatData(queryClient: QueryClient) {
  const chatStore = useChatStore()
  const presenceStore = usePresenceStore()
  const conversationsQuery = useConversationsQuery()
  const usersQuery = useUsersQuery()
  const conversations = computed(() => conversationsQuery.data.value ?? [])
  const users = computed(() => usersQuery.data.value ?? [])
  const activeConversationId = computed(() => chatStore.activeConversationId)
  const activeConversation = computed(
    () =>
      conversations.value.find((conversation) => conversation.id === activeConversationId.value) ??
      null
  )
  const onlineMembersCount = computed(
    () =>
      activeConversation.value?.memberIds.filter(
        (memberId) => presenceStore.statuses[memberId] === 'online'
      ).length ?? 0
  )

  function selectConversation(conversationId: string) {
    chatStore.selectConversation(conversationId)
    updateConversationCache(queryClient, (cached) =>
      cached.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )
    )
  }

  watch(
    conversations,
    (items) => {
      if (!chatStore.activeConversationId && items[0]) {
        selectConversation(items[0].id)
      }
    },
    { immediate: true }
  )

  watch(
    users,
    (items) => {
      const statuses = Object.fromEntries(items.map((user) => [user.id, user.status])) as Record<
        string,
        UserStatus
      >

      presenceStore.setStatuses(statuses)
    },
    { immediate: true }
  )

  return {
    activeConversation,
    activeConversationId,
    chatStore,
    conversations,
    onlineMembersCount,
    selectConversation,
    users
  }
}
