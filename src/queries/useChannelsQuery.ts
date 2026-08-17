import { useQuery } from '@tanstack/vue-query'

import { getChannels } from '@/api/channels.api'
import { queryKeys } from '@/queries/queryKeys'

export function useChannelsQuery() {
  return useQuery({
    queryKey: queryKeys.channels.all,
    queryFn: getChannels
  })
}
