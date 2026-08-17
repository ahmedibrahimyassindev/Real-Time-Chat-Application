import type { Message } from '@/types/message'
import type { Notification } from '@/types/notification'
import type { UserStatus } from '@/types/user'

export type MockWebSocketEvent =
  | { type: 'message.created'; payload: Message }
  | { type: 'message.updated'; payload: Message }
  | { type: 'message.deleted'; payload: { id: string; conversationId: string } }
  | { type: 'message.read'; payload: { id: string; conversationId: string; userId: string } }
  | { type: 'user.online'; payload: { userId: string } }
  | { type: 'user.offline'; payload: { userId: string } }
  | { type: 'presence.changed'; payload: { userId: string; status: UserStatus } }
  | { type: 'typing.started'; payload: { conversationId: string; userId: string } }
  | { type: 'typing.stopped'; payload: { conversationId: string; userId: string } }
  | { type: 'reaction.created'; payload: { messageId: string; emoji: string; userId: string } }
  | { type: 'reaction.deleted'; payload: { messageId: string; emoji: string; userId: string } }
  | { type: 'notification.created'; payload: Notification }

type MockWebSocketListener = (event: MockWebSocketEvent) => void

export class MockWebSocketClient {
  private listeners = new Set<MockWebSocketListener>()
  private connectionTimer: number | undefined
  private reconnectTimer: number | undefined

  isConnected = false

  connect() {
    window.clearTimeout(this.connectionTimer)
    this.connectionTimer = window.setTimeout(() => {
      this.isConnected = true
      this.emit({ type: 'user.online', payload: { userId: 'user-ahmed' } })
    }, 250)
  }

  disconnect() {
    window.clearTimeout(this.connectionTimer)
    window.clearTimeout(this.reconnectTimer)
    this.isConnected = false
    this.emit({ type: 'user.offline', payload: { userId: 'user-ahmed' } })
  }

  simulateConnectionLoss() {
    if (!this.isConnected) {
      return
    }

    this.isConnected = false
    this.emit({ type: 'user.offline', payload: { userId: 'user-ahmed' } })

    this.reconnectTimer = window.setTimeout(() => {
      this.connect()
    }, 1200)
  }

  subscribe(listener: MockWebSocketListener) {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  emit(event: MockWebSocketEvent) {
    this.listeners.forEach((listener) => listener(event))
  }
}

export const mockWebSocketClient = new MockWebSocketClient()
