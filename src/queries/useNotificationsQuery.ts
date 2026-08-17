import { useQuery } from '@tanstack/vue-query'

import { getNotifications } from '@/api/notifications.api'
import { queryKeys } from '@/queries/queryKeys'

export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: getNotifications
  })
}
