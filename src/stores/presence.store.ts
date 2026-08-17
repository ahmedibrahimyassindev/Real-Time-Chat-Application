import { defineStore } from 'pinia'

import type { UserStatus } from '@/types/user'

export const usePresenceStore = defineStore('presence', {
  state: () => ({
    statuses: {} as Record<string, UserStatus>
  }),
  actions: {
    setStatus(userId: string, status: UserStatus) {
      this.statuses[userId] = status
    }
  }
})
