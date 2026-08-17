import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
  const authStore = useAuthStore()
  const { currentUser, isAuthenticated } = storeToRefs(authStore)

  return {
    currentUser,
    isAuthenticated,
    setCurrentUser: authStore.setCurrentUser,
    clearSession: authStore.clearSession
  }
}
