import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    isConnected: false,
    lastConnectedAt: null as string | null
  }),
  actions: {
    setConnected(isConnected: boolean) {
      this.isConnected = isConnected
      this.lastConnectedAt = isConnected ? new Date().toISOString() : this.lastConnectedAt
    }
  }
})
