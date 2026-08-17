import { useQuery } from '@tanstack/vue-query'

import { getConversations } from '@/api/conversations.api'
import { queryKeys } from '@/queries/queryKeys'

export function useConversationsQuery() {
  return useQuery({
    queryKey: queryKeys.conversations.all,
    queryFn: getConversations
  })
}
