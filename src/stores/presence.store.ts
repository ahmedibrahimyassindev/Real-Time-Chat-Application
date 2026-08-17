import { defineStore } from 'pinia'

import { mockUsers } from '@/mocks/data'
import type { UserStatus } from '@/types/user'

export const usePresenceStore = defineStore('presence', {
  state: () => ({
    statuses: Object.fromEntries(mockUsers.map((user) => [user.id, user.status])) as Record<
      string,
      UserStatus
    >
  }),
  getters: {
    onlineCount: (state) =>
      Object.values(state.statuses).filter((status) => status === 'online').length
  },
  actions: {
    setStatus(userId: string, status: UserStatus) {
      this.statuses[userId] = status
    }
  }
})
