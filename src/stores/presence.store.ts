import { defineStore } from 'pinia'

import type { UserStatus } from '@/types/user'

export const usePresenceStore = defineStore('presence', {
  state: () => ({
    statuses: {} as Record<string, UserStatus>
  }),
  getters: {
    onlineCount: (state) =>
      Object.values(state.statuses).filter((status) => status === 'online').length
  },
  actions: {
    setStatuses(statuses: Record<string, UserStatus>) {
      this.statuses = { ...this.statuses, ...statuses }
    },
    setStatus(userId: string, status: UserStatus) {
      this.statuses[userId] = status
    }
  }
})
