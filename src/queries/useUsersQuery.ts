import { useQuery } from '@tanstack/vue-query'

import { getUsers } from '@/api/users.api'
import { queryKeys } from '@/queries/queryKeys'

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: getUsers
  })
}
