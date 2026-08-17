import { computed, ref } from 'vue'
import { io, type Socket } from 'socket.io-client'

import { mapMessage, type BackendMessage } from '@/api/backendAdapters'
import { mockWebSocketClient, type MockWebSocketEvent } from '@/mocks/websocket/mockWebSocket'
import { authStorage } from '@/services/authStorage'
import { useWebSocketStore } from '@/stores/websocket.store'

export type RealtimeEvent = MockWebSocketEvent

const shouldUseMocks = import.meta.env.VITE_ENABLE_MOCKS === 'true'
let socket: Socket | undefined
const listeners = new Set<(event: RealtimeEvent) => void>()

function emitToListeners(event: RealtimeEvent) {
  listeners.forEach((listener) => listener(event))
}

function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_WS_URL ?? 'http://localhost:3000', {
      autoConnect: false,
      auth: {
        token: authStorage.getToken()
      }
    })

    socket.on('connect', () => {
      useWebSocketStore().setConnected(true)
    })
    socket.on('disconnect', () => {
      useWebSocketStore().setConnected(false)
    })
    socket.on('user.online', (payload) => emitToListeners({ type: 'user.online', payload }))
    socket.on('user.offline', (payload) => emitToListeners({ type: 'user.offline', payload }))
    socket.on('typing.started', (payload) => emitToListeners({ type: 'typing.started', payload }))
    socket.on('typing.stopped', (payload) => emitToListeners({ type: 'typing.stopped', payload }))
    socket.on('message.created', (payload: BackendMessage) =>
      emitToListeners({ type: 'message.created', payload: mapMessage(payload) })
    )
    socket.on('message.updated', (payload: BackendMessage) =>
      emitToListeners({ type: 'message.updated', payload: mapMessage(payload) })
    )
    socket.on('message.deleted', (payload: BackendMessage) =>
      emitToListeners({
        type: 'message.deleted',
        payload: { id: payload.id, conversationId: payload.conversationId }
      })
    )
    socket.on('message.read', (payload) => emitToListeners({ type: 'message.read', payload }))
    socket.on('reaction.created', (payload) =>
      emitToListeners({ type: 'reaction.created', payload })
    )
  }

  return socket
}

export function emitTypingEvent(type: 'typing.start' | 'typing.stop', conversationId: string) {
  if (shouldUseMocks) {
    return
  }

  getSocket().emit(type, { conversationId })
}

export function useWebSocket() {
  const webSocketStore = useWebSocketStore()
  const latestEvent = ref<RealtimeEvent | null>(null)
  let unsubscribe: (() => void) | undefined

  function connect() {
    subscribe()

    if (shouldUseMocks) {
      mockWebSocketClient.connect()
      return
    }

    const activeSocket = getSocket()
    activeSocket.auth = { token: authStorage.getToken() }
    activeSocket.connect()
  }

  function disconnect() {
    if (shouldUseMocks) {
      mockWebSocketClient.disconnect()
    } else {
      socket?.disconnect()
    }

    webSocketStore.setConnected(false)
  }

  function subscribe() {
    if (unsubscribe) {
      return unsubscribe
    }

    const listener = (event: RealtimeEvent) => {
      latestEvent.value = event
      webSocketStore.setConnected(
        shouldUseMocks ? mockWebSocketClient.isConnected : Boolean(socket?.connected)
      )
    }

    if (shouldUseMocks) {
      unsubscribe = mockWebSocketClient.subscribe(listener)
    } else {
      listeners.add(listener)
      unsubscribe = () => listeners.delete(listener)
    }

    return unsubscribe
  }

  function unsubscribeFromEvents() {
    unsubscribe?.()
    unsubscribe = undefined
  }

  function simulateConnectionLoss() {
    webSocketStore.setConnected(false)

    if (shouldUseMocks) {
      mockWebSocketClient.simulateConnectionLoss()
    } else {
      socket?.disconnect()
      window.setTimeout(() => socket?.connect(), 1200)
    }
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
