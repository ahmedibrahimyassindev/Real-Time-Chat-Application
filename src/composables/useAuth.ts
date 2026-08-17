import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { currentUser, isAuthenticated, isLoading, errorMessage } = storeToRefs(authStore)

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    errorMessage,
    login: authStore.login,
    register: authStore.register,
    restoreSession: authStore.restoreSession,
    clearSession: authStore.clearSession
  }
}
