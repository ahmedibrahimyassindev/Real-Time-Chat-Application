import { defineStore } from 'pinia'

import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    isAuthenticated: false
  }),
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user
      this.isAuthenticated = true
    },
    clearSession() {
      this.currentUser = null
      this.isAuthenticated = false
    }
  }
})
