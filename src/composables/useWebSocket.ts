import { ref } from 'vue'

import { mockWebSocketClient, type MockWebSocketEvent } from '@/mocks/websocket/mockWebSocket'

export function useWebSocket() {
  const isConnected = ref(false)
  const latestEvent = ref<MockWebSocketEvent | null>(null)

  const unsubscribe = mockWebSocketClient.subscribe((event) => {
    latestEvent.value = event
    isConnected.value = mockWebSocketClient.isConnected
  })

  function connect() {
    mockWebSocketClient.connect()
  }

  function disconnect() {
    mockWebSocketClient.disconnect()
    unsubscribe()
  }

  function simulateConnectionLoss() {
    isConnected.value = false
    mockWebSocketClient.simulateConnectionLoss()
  }

  return {
    isConnected,
    latestEvent,
    connect,
    disconnect,
    simulateConnectionLoss
  }
}
