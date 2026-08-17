import { computed, type Ref } from 'vue'
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'

import { getMessages, searchMessages } from '@/api/messages.api'
import { queryKeys } from '@/queries/queryKeys'

export function useMessagesQuery(conversationId: Ref<string>) {
  return useInfiniteQuery({
    queryKey: computed(() => queryKeys.messages.conversation(conversationId.value)),
    queryFn: ({ pageParam }) => getMessages(conversationId.value, { cursor: pageParam, limit: 4 }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: computed(() => Boolean(conversationId.value))
  })
}

export function useMessageSearchQuery(query: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.messages.search(query.value)),
    queryFn: () => searchMessages(query.value),
    enabled: computed(() => Boolean(query.value.trim()))
  })
}
