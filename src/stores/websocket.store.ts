import { defineStore } from 'pinia'

export const useWebSocketStore = defineStore('websocket', {
  state: () => ({
    isConnected: false,
    reconnectAttempts: 0,
    lastConnectedAt: null as string | null
  }),
  actions: {
    setConnected(isConnected: boolean) {
      this.isConnected = isConnected
      this.lastConnectedAt = isConnected ? new Date().toISOString() : this.lastConnectedAt
      this.reconnectAttempts = isConnected ? 0 : this.reconnectAttempts
    },
    recordReconnectAttempt() {
      this.reconnectAttempts += 1
    }
  }
})
