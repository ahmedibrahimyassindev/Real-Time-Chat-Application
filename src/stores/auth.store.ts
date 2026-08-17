import { defineStore } from 'pinia'

import { getSessionUser, login, register } from '@/api/auth.api'
import type { LoginInput, RegisterInput } from '@/schemas/auth.schema'
import type { User } from '@/types/user'

const authTokenStorageKey = 'realtime-chat.auth-token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    token: localStorage.getItem(authTokenStorageKey),
    isLoading: false,
    errorMessage: ''
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.currentUser)
  },
  actions: {
    setSession(user: User, token: string) {
      this.currentUser = user
      this.token = token
      this.errorMessage = ''
      localStorage.setItem(authTokenStorageKey, token)
    },
    clearSession() {
      this.currentUser = null
      this.token = null
      this.errorMessage = ''
      localStorage.removeItem(authTokenStorageKey)
    },
    async login(input: LoginInput) {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const session = await login(input)
        this.setSession(session.user, session.token)
      } catch {
        this.errorMessage = 'Unable to login with those details.'
        throw new Error(this.errorMessage)
      } finally {
        this.isLoading = false
      }
    },
    async register(input: RegisterInput) {
      this.isLoading = true
      this.errorMessage = ''

      try {
        const session = await register(input)
        this.setSession(session.user, session.token)
      } catch {
        this.errorMessage = 'Unable to create that account.'
        throw new Error(this.errorMessage)
      } finally {
        this.isLoading = false
      }
    },
    async restoreSession() {
      if (!this.token || this.currentUser) {
        return
      }

      this.isLoading = true

      try {
        this.currentUser = await getSessionUser()
      } catch {
        this.clearSession()
      } finally {
        this.isLoading = false
      }
    }
  }
})
