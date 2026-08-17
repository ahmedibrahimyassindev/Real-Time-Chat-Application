import { ref } from 'vue'

export function useWebSocket() {
  const isConnected = ref(false)

  function connect() {
    isConnected.value = true
  }

  function disconnect() {
    isConnected.value = false
  }

  return {
    isConnected,
    connect,
    disconnect
  }
}
