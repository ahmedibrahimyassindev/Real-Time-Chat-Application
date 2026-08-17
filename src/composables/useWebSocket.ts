import { computed, ref } from 'vue'

import { mockWebSocketClient, type MockWebSocketEvent } from '@/mocks/websocket/mockWebSocket'
import { useWebSocketStore } from '@/stores/websocket.store'

export function useWebSocket() {
  const webSocketStore = useWebSocketStore()
  const latestEvent = ref<MockWebSocketEvent | null>(null)
  let unsubscribe: (() => void) | undefined

  function connect() {
    subscribe()
    mockWebSocketClient.connect()
  }

  function disconnect() {
    mockWebSocketClient.disconnect()
    webSocketStore.setConnected(false)
  }

  function subscribe() {
    if (unsubscribe) {
      return unsubscribe
    }

    unsubscribe = mockWebSocketClient.subscribe((event) => {
      latestEvent.value = event
      webSocketStore.setConnected(mockWebSocketClient.isConnected)
    })

    return unsubscribe
  }

  function unsubscribeFromEvents() {
    unsubscribe?.()
    unsubscribe = undefined
  }

  function simulateConnectionLoss() {
    webSocketStore.setConnected(false)
    mockWebSocketClient.simulateConnectionLoss()
  }

  return {
    isConnected: computed(() => webSocketStore.isConnected),
    latestEvent,
    connect,
    disconnect,
    subscribe,
    unsubscribe: unsubscribeFromEvents,
    simulateConnectionLoss
  }
}
